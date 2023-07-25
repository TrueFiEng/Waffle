import {Contract, Signer} from 'ethers';

export type Account = Signer | Contract;

export async function getAddressOf(account: Account) {
  return account.getAddress();
}
