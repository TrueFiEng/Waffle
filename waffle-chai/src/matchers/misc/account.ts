import {Contract, Signer} from 'ethers';

export type Account = Signer | Contract;

export async function getAddressOf(account: Account) {
  return account.getAddress();
}

export function getProvider(account: Account) {
  if (account instanceof Contract) {
    return account.runner?.provider;
  }
  return account.provider;
}
