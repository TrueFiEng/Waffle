import {Contract, ContractFactory, Signer, utils} from 'ethers';
import type {JsonFragment} from '@ethersproject/abi';

import DoppelgangerContract from './Doppelganger.json';
import {JsonRpcProvider} from '@ethersproject/providers';

type ABI = string | Array<utils.Fragment | JsonFragment | string>

export type Stub = ReturnType<typeof stub>;

export interface MockContract extends Contract {
  mock: {
    [key: string]: Stub;
  };
  call (contract: Contract, functionName: string, ...params: any[]): Promise<any>;
  staticcall (contract: Contract, functionName: string, ...params: any[]): Promise<any>;
}

async function deploy(signer: Signer, address?: string) {
  if (address) {
    const provider = signer.provider as JsonRpcProvider;
    if (await provider.getCode(address) !== '0x') {
      throw new Error(`${address} already contains a contract`);
    }
    if ((provider as any)._hardhatNetwork) {
      if (await provider.send('hardhat_setCode', [
        address,
        '0x' + DoppelgangerContract.evm.deployedBytecode.object
      ])) {
        return new Contract(address, DoppelgangerContract.abi, signer);
      } else throw new Error(`Couldn't deploy at ${address}`);
    } else {
      if (await provider.send('evm_setAccountCode', [
        address,
        '0x' + DoppelgangerContract.evm.deployedBytecode.object
      ])) {
        return new Contract(address, DoppelgangerContract.abi, signer);
      } else throw new Error(`Couldn't deploy at ${address}`);
    }
  }
  const factory = new ContractFactory(DoppelgangerContract.abi, DoppelgangerContract.bytecode, signer);
  return factory.deploy();
}

function stub(mockContract: Contract, encoder: utils.AbiCoder, func: utils.FunctionFragment, params?: any[]) {
  const callData = params
    ? mockContract.interface.encodeFunctionData(func, params)
    : mockContract.interface.getSighash(func);

  return {
    returns: async (...args: any) => {
      if (!func.outputs) return;
      const encoded = encoder.encode(func.outputs, args);
      await mockContract.__waffle__mockReturns(callData, encoded);
    },
    reverts: async () => mockContract.__waffle__mockReverts(callData, 'Mock revert'),
    revertsWithReason: async (reason: string) => mockContract.__waffle__mockReverts(callData, reason),
    withArgs: (...args: any[]) => stub(mockContract, encoder, func, args)
  };
}

function createMock(abi: ABI, mockContractInstance: Contract) {
  const {functions} = new utils.Interface(abi);
  const encoder = new utils.AbiCoder();

  const mockedAbi = Object.values(functions).reduce((acc, func) => {
    const stubbed = stub(mockContractInstance, encoder, func);
    return {
      ...acc,
      [func.name]: stubbed,
      [func.format()]: stubbed
    };
  }, {} as MockContract['mock']);

  return mockedAbi;
}

export async function deployMockContract(signer: Signer, abi: ABI, address?: string): Promise<MockContract> {
  const mockContractInstance = await deploy(signer, address);

  const mock = createMock(abi, mockContractInstance);
  const mockedContract = new Contract(mockContractInstance.address, abi, signer) as MockContract;
  mockedContract.mock = mock;

  const encoder = new utils.AbiCoder();

  mockedContract.staticcall = async (contract: Contract, functionName: string, ...params: any[]) => {
    let func: utils.FunctionFragment = contract.interface.functions[functionName];
    if (!func) {
      func = Object.values(contract.interface.functions).find(f => f.name === functionName) as utils.FunctionFragment;
    }
    if (!func) {
      throw new Error(`Unknown function ${functionName}`);
    }
    if (!func.outputs) {
      throw new Error('Cannot staticcall function with no outputs');
    }
    const tx = await contract.populateTransaction[functionName](...params);
    const data = tx.data;
    let result;
    const returnValue = await mockContractInstance.__waffle__staticcall(contract.address, data);
    result = encoder.decode(func.outputs, returnValue);
    if (result.length === 1) {
      result = result[0];
    }
    return result;
  };

  mockedContract.call = async (contract: Contract, functionName: string, ...params: any[]) => {
    const tx = await contract.populateTransaction[functionName](...params);
    const data = tx.data;
    return mockContractInstance.__waffle__call(contract.address, data);
  };

  return mockedContract;
}
