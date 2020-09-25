import {Contract, Signer, Wallet} from 'ethers';

export type Account = Signer | Contract;

export async function getAddressOf(account: Account) {
  if (account instanceof Contract || account instanceof Wallet) {
    return account.address;
  } else {
    return account.getAddress();
  }
}
