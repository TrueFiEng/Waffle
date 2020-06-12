import {Contract, ContractFactory, Signer, utils} from 'ethers';
import {Fragment, JsonFragment} from '@ethersproject/abi';

import DoppelgangerContract from './Doppelganger.json';

type ABI = string | Array<Fragment | JsonFragment | string>

async function deploy(signer: Signer) {
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
    reverts: async () => mockContract.__waffle__mockReverts(callData),
    withArgs: (...args: any[]) => stub(mockContract, encoder, func, args)
  };
}

function createMock(abi: ABI, mockContractInstance: Contract) {
  const {functions} = new utils.Interface(abi);
  const encoder = new utils.AbiCoder();

  return Object.values(functions).reduce((acc, func) => {
    const stubbed = stub(mockContractInstance, encoder, func);
    return {
      ...acc,
      [func.name]: stubbed,
      [func.format()]: stubbed
    };
  }, {} as MockContract['mock']);
}

export type Stub = ReturnType<typeof stub>;

export interface MockContract extends Contract {
  mock: {
    [key: string]: Stub;
  };
}

export async function deployMockContract(signer: Signer, abi: ABI): Promise<MockContract> {
  const mockContractInstance = await deploy(signer);

  const mock = createMock(abi, mockContractInstance);
  const mockedContract = new Contract(mockContractInstance.address, abi, signer) as MockContract;
  mockedContract.mock = mock;

  return mockedContract;
}
