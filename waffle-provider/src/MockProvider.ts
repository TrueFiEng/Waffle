import {providers, Wallet} from 'ethers';
import {CallHistory, RecordedCall} from './CallHistory';
import {defaultAccounts} from './defaultAccounts';
import Ganache from 'ganache-core';
import {deployENS, ENS} from '@ethereum-waffle/ens';
import {BuidlerEVMProvider} from '@nomiclabs/buidler/internal/buidler-evm/provider/provider';
import {BUIDLEREVM_NETWORK_NAME} from '@nomiclabs/buidler/plugins';

export {RecordedCall};

const {
  blockGasLimit,
  chainId,
  hardfork,
  throwOnCallFailures,
  throwOnTransactionFailures
} = {
  hardfork: 'istanbul',
  blockGasLimit: 9500000,
  chainId: 31337,
  throwOnTransactionFailures: true,
  throwOnCallFailures: true
};

function toHardhatGenesisAccounts(accounts: typeof defaultAccounts) {
  return accounts.map(({balance, secretKey}) => ({balance, privateKey: secretKey}));
}

interface MockProviderOptions {
  ganacheOptions: Ganache.IProviderOptions;
}

export class RequestableBuidlerProvider extends BuidlerEVMProvider {
  request(args: { method: string; params?: Array<any> }): Promise<any> {
    return this['_send'](args.method, args.params);
  }
}

export class MockProvider extends providers.Web3Provider {
  private _callHistory: CallHistory
  private _ens?: ENS;

  constructor(private options?: MockProviderOptions) {
    super(new RequestableBuidlerProvider(
      hardfork,
      BUIDLEREVM_NETWORK_NAME,
      chainId,
      chainId,
      blockGasLimit,
      throwOnTransactionFailures,
      throwOnCallFailures,
      toHardhatGenesisAccounts(defaultAccounts)
    ) as any);
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
