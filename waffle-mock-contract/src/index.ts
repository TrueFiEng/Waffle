import {Contract, ContractFactory, utils, Wallet} from 'ethers';
import DoppelgangerContract from './Doppelganger.json';

type ABI = Array<utils.EventFragment | utils.FunctionFragment | utils.ParamType> | string;

async function deploy(wallet: Wallet) {
  const factory = new ContractFactory(DoppelgangerContract.abi, DoppelgangerContract.bytecode, wallet);
  return factory.deploy();
}

function stub(mockContract: Contract, encoder: utils.AbiCoder, func: utils.FunctionDescription, params?: any[]) {
  const callData = params ? func.encode(params) : func.sighash;

  return {
    returns: async (...args: any) => {
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
  call: Function,
  staticcall: Function
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

  mockedContract.staticcall = async (contract: Contract, functionName: string, ...params: any) => {
    let fn = contract.interface.functions[functionName]
    let data = fn.encode(params)
    let result
    let returnValue = await mockContractInstance.__waffle__staticcall(contract.address, data)
    result = fn.decode(returnValue);
    if (result.length == 1) {
      result = result[0]
    }
    return result
  }

  mockedContract.call = async (contract: Contract, functionName: string, ...params: any) => {
    let data = contract.interface.functions[functionName].encode(params)
    return await mockContractInstance.__waffle__call(contract.address, data)
  }

  return mockedContract;
}
