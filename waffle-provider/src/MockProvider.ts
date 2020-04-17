import {providers, Wallet} from 'ethers';
import {defaultAccounts} from './defaultAccounts';
import Ganache from 'ganache-core';
import {DebugProvider} from './DebugProvider';

const defaults = {
  accounts: defaultAccounts
};

export class MockProvider extends providers.Web3Provider {
  constructor(private options?: Ganache.IProviderOptions) {
    super(new DebugProvider(Ganache.provider({...defaults, ...options}) as any));
  }

  getWallets() {
    const items = this.options?.accounts ?? defaults.accounts;
    return items.map((x: any) => new Wallet(x.secretKey, this));
  }

  createEmptyWallet() {
    return Wallet.createRandom().connect(this);
  }
}
