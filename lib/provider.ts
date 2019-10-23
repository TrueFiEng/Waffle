import {GanacheOpts} from 'ganache-core';
import {providers, Wallet} from 'ethers';
import {createGanacheProvider} from './';
import defaultAccounts from './config/defaultAccounts';

export const createMockProvider = (providerOptionsOrPathToConfig: string | GanacheOpts = {}) => {
  return createGanacheProvider(providerOptionsOrPathToConfig);
};

export function getWallets(provider: providers.Provider) {
  return defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
}
