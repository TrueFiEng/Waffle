import {providers, Wallet} from 'ethers';
import {CallHistory, RecordedCall} from './CallHistory';
import {defaultAccounts} from './defaultAccounts';
import type Ganache from 'ganache-core';
import {deployENS, ENS} from '@ethereum-waffle/ens';

export {RecordedCall};

interface MockProviderOptions {
  ganacheOptions: Ganache.IProviderOptions;
}

export class MockProvider extends providers.Web3Provider {
  private _callHistory: CallHistory
  private _ens?: ENS;

  constructor(private options?: MockProviderOptions) {
    super(require('ganache-core').provider({accounts: defaultAccounts, ...options?.ganacheOptions}) as any);
    this._callHistory = new CallHistory();
    this._callHistory.record(this);
  }

  getWallets() {
    const items = this.options?.ganacheOptions.accounts ?? defaultAccounts;
    return items.map((x: any) => new Wallet(x.secretKey, this));
  }

  createEmptyWallet() {
    return Wallet.createRandom().connect(this);
  }

  clearCallHistory() {
    this._callHistory.clear();
  }

  get callHistory(): readonly RecordedCall[] {
    return this._callHistory.getCalls();
  }

  get ens(): ENS | undefined {
    return this._ens;
  }

  async setupENS(wallet?: Wallet) {
    if (!wallet) {
      const wallets = this.getWallets();
      wallet = wallets[wallets.length - 1];
    }
    const ens = await deployENS(wallet);
    this.network.ensAddress = ens.ens.address;
    this._ens = ens;
  }
}
