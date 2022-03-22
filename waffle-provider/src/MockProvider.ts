import {providers, Wallet} from 'ethers';
import {CallHistory, RecordedCall} from './CallHistory';
import {defaultAccounts} from './defaultAccounts';
import type {EthereumProviderOptions, Provider} from 'ganache';

import {deployENS, ENS} from '@ethereum-waffle/ens';

export {RecordedCall};

interface MockProviderOptions {
  ganacheOptions: EthereumProviderOptions;
}

export class MockProvider extends providers.Web3Provider {
  private _callHistory: CallHistory
  private _ens?: ENS;

  constructor(private options?: MockProviderOptions) {
    const mergedOptions: EthereumProviderOptions = {
      wallet: {
        accounts: defaultAccounts
      },
      logging: {quiet: true},
      chain: {
        hardfork: 'berlin'
      },
      ...options?.ganacheOptions
    };
    const ganacheProvider: Provider = require('ganache').provider(mergedOptions);
    const callHistory = new CallHistory();
    const recordedGanacheProvider = callHistory.record(ganacheProvider);

    super(recordedGanacheProvider as any);
    this._callHistory = callHistory;
  }

  getWallets() {
    const items = this.options?.ganacheOptions.wallet?.accounts ?? defaultAccounts;
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
