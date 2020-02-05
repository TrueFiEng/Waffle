import Ganache from 'ganache-core';
import {providers, Wallet} from 'ethers';
import {MockProvider} from './MockProvider';
import {deprecate} from './deprecate';

/**
 * @deprecated Use `new MockProvider(options?)`
 */
export function createMockProvider(ganacheOptionsOrPathToConfig: string | Ganache.IProviderOptions = {}) {
  deprecate('createMockProvider', 'Use "new MockProvider(options?)" instead.');
  return new MockProvider(getGanacheOptions(ganacheOptionsOrPathToConfig));
}

/**
 * @deprecated
 */
export function getGanacheOptions(ganacheOptionsOrPathToConfig: string | Ganache.IProviderOptions) {
  deprecate('getGanacheOptions');
  if (typeof ganacheOptionsOrPathToConfig !== 'string') {
    return ganacheOptionsOrPathToConfig;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(ganacheOptionsOrPathToConfig).ganacheOptions;
}

/**
 * Enables third party providers to use the legacy `getWallets` api.
 * @deprecated
 */
export interface MockProviderLike extends providers.Provider {
  getWallets(): Wallet[];
  createEmptyWallet(): Wallet;
}

/**
 * @deprecated Use `mockProvider.getWallets()`
 */
export function getWallets(provider: MockProviderLike) {
  deprecate('getWallets', 'Use "mockProvider.getWallets()" instead.');
  return provider.getWallets();
}
