import {Contract, Signer} from 'ethers';

export type Account = Signer | Contract;

export async function getBalanceOf(account: Account) {
  if (account instanceof Contract) {
    return account.provider.getBalance(account.address);
  } else {
    return account.getBalance();
  }
}

export async function getAddressOf(account: Account) {
  if (account instanceof Contract) {
    return account.address;
  } else {
    return account.getAddress();
  }
}
