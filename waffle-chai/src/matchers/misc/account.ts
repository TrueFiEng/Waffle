import {Contract, Signer} from 'ethers';
import { ensure } from '../calledOnContract/utils';

export type Account = Signer | Contract;

export async function getBalanceOf(account: Account, blockNumber?: number) {
  if (blockNumber) {
    ensure(account.provider !== undefined, TypeError, 'Provider not found');

    return account.provider.getBalance(getAddressOf(account), blockNumber);
  } else {
    if (account instanceof Contract) {
      return account.provider.getBalance(account.address);
    } else {
      return account.getBalance();
    }
  }
}

export async function getAddressOf(account: Account) {
  if (account instanceof Contract) {
    return account.address;
  } else {
    return account.getAddress();
  }
}