import {utils, Contract, Wallet} from 'ethers';
import {FunctionDescription} from 'ethers/utils/interface';
import {EventFragment, FunctionFragment, ParamType} from 'ethers/utils/abi-coder';
import {deployContract} from 'ethereum-waffle';
import DoppelgangerContract from '../build/Doppelganger.json';

type ABI = Array<EventFragment | FunctionFragment | ParamType> | string;

function stub(mockContract: Contract, encoder: utils.AbiCoder, func: FunctionDescription) {
  return {
    returns: async (...args: any) => {
      const encoded = encoder.encode(func.outputs, args);
      await mockContract.mockReturns(func.sighash, encoded);
    }
  };
}

export type Doppelganger = {
  [key: string]: ReturnType<typeof stub>;
} & {
  contract: Contract;
  address: string;
}

export async function doppelganger(wallet: Wallet, abi: ABI, contractInstance?: Contract):
Promise<Doppelganger> {
  const instance = contractInstance ?? await deployContract(wallet, DoppelgangerContract);

  const {functions} = new utils.Interface(abi);
  const encoder = new utils.AbiCoder();

  return Object.values(functions).reduce((acc, func) => ({
    ...acc,
    [func.name]: stub(instance, encoder, func)
  }), {
    contract: new Contract(instance.address, abi, wallet),
    address: instance.address
  } as Doppelganger);
}
