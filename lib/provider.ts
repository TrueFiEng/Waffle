import Ganache, {GanacheOpts} from 'ganache-core';
import {providers, Wallet} from 'ethers';
import defaultAccounts from './config/defaultAccounts';

const defaultGanacheOptions = {accounts: defaultAccounts};

export function createMockProvider(ganacheOptionsOrPathToConfig: string | GanacheOpts = {}) {
  const ganacheOptions = getGanacheOptions(ganacheOptionsOrPathToConfig);
  const options = {...defaultGanacheOptions, ...ganacheOptions };
  return new providers.Web3Provider(Ganache.provider(options));
};

export function getGanacheOptions(ganacheOptionsOrPathToConfig: string | GanacheOpts) {
  if (typeof ganacheOptionsOrPathToConfig === 'object') {
    return ganacheOptionsOrPathToConfig;
  }
  const {ganacheOptions} = require(ganacheOptionsOrPathToConfig);
  return ganacheOptions;
};

export function getWallets(provider: providers.Provider) {
  return defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
}
