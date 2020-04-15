import {utils, Contract, Wallet, ContractFactory} from 'ethers';
import {FunctionDescription} from 'ethers/utils/interface';
import {EventFragment, FunctionFragment, ParamType} from 'ethers/utils/abi-coder';
import DoppelgangerContract from './Doppelganger.json';

type ABI = Array<EventFragment | FunctionFragment | ParamType> | string;

async function deployDoppelganger(wallet: Wallet) {
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

export interface Doppelganger extends Contract {
  mock: {
    [key: string]: ReturnType<typeof stub>;
  };
}

export async function doppelganger(wallet: Wallet, abi: ABI, contractInstance?: Contract):
Promise<Doppelganger> {
  const doppelgangerInstance = contractInstance ?? await deployDoppelganger(wallet);

  const {functions} = new utils.Interface(abi);
  const encoder = new utils.AbiCoder();

  const mock = Object.values(functions).reduce((acc, func) => ({
    ...acc,
    [func.name]: stub(doppelgangerInstance, encoder, func)
  }), {} as Doppelganger['mock']);

  const mockedContract = new Contract(doppelgangerInstance.address, abi, wallet);

  return {
    ...mockedContract,
    mock
  } as Doppelganger;
}
