import {Contract, ContractFactory, utils, Wallet} from 'ethers';
import {FunctionDescription} from 'ethers/utils/interface';
import {EventFragment, FunctionFragment, ParamType} from 'ethers/utils/abi-coder';
import DoppelgangerContract from './Doppelganger.json';

type ABI = Array<EventFragment | FunctionFragment | ParamType> | string;

async function deploy(wallet: Wallet) {
  const factory = new ContractFactory(DoppelgangerContract.abi, DoppelgangerContract.bytecode, wallet);
  return factory.deploy();
}

function stub(mockContract: Contract, encoder: utils.AbiCoder, func: FunctionDescription) {
  return {
    returns: async (...args: any) => {
      const encoded = encoder.encode(func.outputs, args);
      await mockContract.mockReturns(func.sighash, encoded);
    }
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

export interface MockContract extends Contract {
  mock: {
    [key: string]: ReturnType<typeof stub>;
  };
}

export async function deployMockContract(wallet: Wallet, abi: ABI, contractInstance?: Contract):
Promise<MockContract> {
  const mockContractInstance = contractInstance ?? await deploy(wallet);

  const mock = createMock(abi, mockContractInstance);
  const mockedContract = new Contract(mockContractInstance.address, abi, wallet);

  return {
    ...mockedContract,
    mock
  } as MockContract;
}
