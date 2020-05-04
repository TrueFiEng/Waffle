import {Contract, ContractFactory, utils, Wallet} from 'ethers';
import {Fragment, JsonFragment} from '@ethersproject/abi';

import DoppelgangerContract from './Doppelganger.json';

type ABI = string | Array<Fragment | JsonFragment | string>

async function deploy(wallet: Wallet) {
  const factory = new ContractFactory(DoppelgangerContract.abi, DoppelgangerContract.bytecode, wallet);
  return factory.deploy();
}

function stub(mockContract: Contract, encoder: utils.AbiCoder, func: utils.FunctionFragment, params?: any[]) {
  const callData = params
    ? mockContract.interface.encodeFunctionData(func.name, params)
    : mockContract.interface.getSighash(func.name);

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

  return Object.values(functions).reduce((acc, func) => ({
    ...acc,
    [func.name]: stub(mockContractInstance, encoder, func)
  }), {} as MockContract['mock']);
}

export type Stub = ReturnType<typeof stub>;

export interface MockContract extends Contract {
  mock: {
    [key: string]: Stub;
  };
}

export async function deployMockContract(wallet: Wallet, abi: ABI): Promise<MockContract> {
  console.warn(
    'deployMockContract is an experimental feature. ' +
    'Breaking changes will not result in a new major version'
  );
  const mockContractInstance = await deploy(wallet);

  const mock = createMock(abi, mockContractInstance);
  const mockedContract = new Contract(mockContractInstance.address, abi, wallet) as MockContract;
  mockedContract.mock = mock;

  return mockedContract;
}
