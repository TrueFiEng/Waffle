import Ganache from 'ganache-core';
import {providers, Wallet} from 'ethers';
import defaultAccounts from './config/defaultAccounts';

const defaultGanacheOptions = {accounts: defaultAccounts};

export function createMockProvider(ganacheOptionsOrPathToConfig: string | Ganache.IProviderOptions = {}) {
  const ganacheOptions = getGanacheOptions(ganacheOptionsOrPathToConfig);
  const options = {...defaultGanacheOptions, ...ganacheOptions};
  return new providers.Web3Provider(Ganache.provider(options) as any);
}

export function getGanacheOptions(ganacheOptionsOrPathToConfig: string | Ganache.IProviderOptions) {
  if (typeof ganacheOptionsOrPathToConfig === 'object') {
    return ganacheOptionsOrPathToConfig;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {ganacheOptions} = require(ganacheOptionsOrPathToConfig);
  return ganacheOptions;
}

export function getWallets(provider: providers.Provider) {
  return defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
}
