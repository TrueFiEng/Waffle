import Ganache from 'ganache-core';
import {providers, Wallet} from 'ethers';
import {defaultAccounts} from './defaultAccounts';
import { MockProvider } from './MockProvider';
import { deprecate } from './deprecate';

export function createMockProvider(ganacheOptionsOrPathToConfig: string | Ganache.IProviderOptions = {}) {
  deprecate('createMockProvider', 'Use "new MockProvider(options?)" instead.')
  return new MockProvider(getGanacheOptions(ganacheOptionsOrPathToConfig));
}

export function getGanacheOptions(ganacheOptionsOrPathToConfig: string | Ganache.IProviderOptions) {
  deprecate('getGanacheOptions')
  if (typeof ganacheOptionsOrPathToConfig === 'object') {
    return ganacheOptionsOrPathToConfig;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(ganacheOptionsOrPathToConfig).ganacheOptions;
}

export function getWallets(provider: providers.Provider) {
  deprecate('getWallets', 'Use "mockProvider.getWallets()" instead.')
  if (provider instanceof MockProvider) {
    return provider.getWallets();
  }
  return defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
}
