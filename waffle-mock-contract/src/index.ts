import {Contract, ContractFactory, Signer, utils} from 'ethers';
import type {JsonFragment} from '@ethersproject/abi';

import DoppelgangerContract from './Doppelganger.json';
import type {JsonRpcProvider} from '@ethersproject/providers';

type ABI = string | Array<utils.Fragment | JsonFragment | string>

interface IStub {
  returns(...args: any): IStub;
  reverts(): IStub;
  revertsWithReason(reason: string): IStub;
  withArgs(...args: any): IStub;
  then(resolve: () => void, reject: () => void): Promise<void>;
}

export interface MockContract extends Contract {
  mock: {
    [key: string]: IStub;
  };
  call (contract: Contract, functionName: string, ...params: any[]): Promise<any>;
  staticcall (contract: Contract, functionName: string, ...params: any[]): Promise<any>;
}

class Stub implements IStub {
  callData: string;
  stubCalls: Array<() => Promise<any>> = [];
  revertSet = false;
  argsSet = false;

  constructor(
    private mockContract: MockContract,
    private encoder: utils.AbiCoder,
    private func: utils.FunctionFragment
  ) {
    this.callData = mockContract.interface.getSighash(func);
  }

  private err(reason: string) {
    this.stubCalls = [];
    this.revertSet = false;
    this.argsSet = false;
    throw new Error(reason);
  }

  returns(...args: any) {
    if (this.revertSet) this.err('Revert must be the last call');
    if (!this.func.outputs) return this; // Throw ?
    const encoded = this.encoder.encode(this.func.outputs, args);
    if (this.stubCalls.length === 0) {
      this.stubCalls.push(async () => {
        await this.mockContract.__waffle__mockReturns(this.callData, encoded);
      });
    } else {
      this.stubCalls.push(async () => {
        await this.mockContract.__waffle__queueReturn(this.callData, encoded);
      });
    }
    return this;
  }

  reverts() {
    if (this.revertSet) this.err('Revert must be the last call');
    if (this.stubCalls.length === 0) {
      this.stubCalls.push(async () => {
        await this.mockContract.__waffle__mockReverts(this.callData, 'Mock revert');
      });
    } else {
      this.stubCalls.push(async () => {
        await this.mockContract.__waffle__queueRevert(this.callData, 'Mock revert');
      });
    }
    this.revertSet = true;
    return this;
  }

  revertsWithReason(reason: string) {
    if (this.revertSet) this.err('Revert must be the last call');
    if (this.stubCalls.length === 0) {
      this.stubCalls.push(async () => {
        await this.mockContract.__waffle__mockReverts(this.callData, reason);
      });
    } else {
      this.stubCalls.push(async () => {
        await this.mockContract.__waffle__queueRevert(this.callData, reason);
      });
    }
    this.revertSet = true;
    return this;
  }

  withArgs(...params: any[]) {
    if (this.argsSet) this.err('withArgs can be called only once');
    this.callData = this.mockContract.interface.encodeFunctionData(this.func, params);
    this.argsSet = true;
    return this;
  }

  async then(resolve: () => void, reject: () => void) {
    let promise = Promise.resolve();

    for (let i = 0; i < this.stubCalls.length; i++) {
      promise = new Promise((res, rej) => {
        promise.then(() => {
          this.stubCalls[i]().then(res).catch(rej);
        }).catch(rej);
      });
    }

    promise.then(() => {
      this.stubCalls = [];
      this.revertSet = false;
      this.argsSet = false;
      resolve();
    }).catch(reject);
  } // ?????????????
}

type DeployOptions = {
  address: string;
  override?: boolean;
}

async function deploy(signer: Signer, options?: DeployOptions) {
  if (options) {
    const {address, override} = options;
    const provider = signer.provider as JsonRpcProvider;
    if (!override && await provider.getCode(address) !== '0x') {
      throw new Error(
        `${address} already contains a contract. ` +
        'If you want to override it, set the override parameter.');
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

function createMock(abi: ABI, mockContractInstance: Contract) {
  const {functions} = new utils.Interface(abi);
  const encoder = new utils.AbiCoder();

  const mockedAbi = Object.values(functions).reduce((acc, func) => {
    const stubbed = new Stub(mockContractInstance as MockContract, encoder, func);
    return {
      ...acc,
      [func.name]: stubbed,
      [func.format()]: stubbed
    };
  }, {} as MockContract['mock']);

  mockedAbi.receive = {
    returns: async () => { throw new Error('Receive function return is not implemented.'); },
    withArgs: () => { throw new Error('Receive function return is not implemented.'); },
    reverts: async () => mockContractInstance.__waffle__receiveReverts('Mock Revert'),
    revertsWithReason: async (reason: string) => mockContractInstance.__waffle__receiveReverts(reason)
  };

  return mockedAbi;
}

export async function deployMockContract(signer: Signer, abi: ABI, options?: DeployOptions): Promise<MockContract> {
  const mockContractInstance = await deploy(signer, options);

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
