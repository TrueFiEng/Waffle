import {providers, Wallet} from 'ethers';
import {CallHistory, RecordedCall} from './CallHistory';
import {defaultAccounts} from './defaultAccounts';
import type {EthereumProvider, Provider} from 'ganache';
import type {EthereumProviderOptions} from '@ganache/ethereum-options';

import {deployENS, ENS} from '@ethereum-waffle/ens';
import {injectRevertString} from './revertString';

export {RecordedCall};

export interface MockProviderOptions {
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
    const provider: Provider = require('ganache').provider(mergedOptions);
    const callHistory = new CallHistory();
    const patchedProvider = injectRevertString(callHistory.record(provider));

    super(patchedProvider as any);
    this._callHistory = callHistory;

    /**
     * The override to the provider's formatter allows us to inject
     * additional values to a transaction receipt.
     * We inject a `revertString` in overriden `eth_getTransactionReceipt` handler.
     * Ethers do not bubble up a revert error message when a transaction reverts,
     * but it does bubble it up when a call (query) reverts.
     * In order to make the revert string accessible for matchers like `revertedWith`,
     * we need to simulate transactions as queries and add the revert string to the receipt.
     */
    (this.formatter as any).formats = {
      ...this.formatter.formats,
      receipt: {
        ...this.formatter.formats.receipt,
        revertString: (val: any) => val
      }
    };
  }

  getWallets() {
    const accounts = (this.provider as unknown as EthereumProvider).getInitialAccounts();
    return Object.values(accounts).map((x: any) => new Wallet(x.secretKey, this));
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
