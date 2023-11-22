import {BigNumberish} from 'ethers';
import {ensure} from '../calledOnContract/utils';
import {Account, getAddressOf, getProvider} from './account';

export interface BalanceChangeOptions {
  includeFee?: boolean;
  errorMargin?: BigNumberish;
}

export function getAddresses(accounts: Account[]) {
  return Promise.all(accounts.map((account) => getAddressOf(account)));
}

export async function getBalances(accounts: Account[], blockNumber?: number) {
  return Promise.all(
    accounts.map((account) => {
      const provider = getProvider(account);
      ensure(provider !== undefined && provider !== null, TypeError, 'Provider not found');
      if (blockNumber !== undefined) {
        return provider.getBalance(getAddressOf(account), blockNumber);
      } else {
        return provider.getBalance(getAddressOf(account));
      }
    })
  );
}
