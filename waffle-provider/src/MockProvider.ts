import {providers, Wallet} from 'ethers';
import {CallHistory, RecordedCall} from './CallHistory';
import {defaultAccounts} from './defaultAccounts';
import Ganache from 'ganache-core';
import {deployENS, ENS} from '@ethereum-waffle/ens';
import {HardhatNetworkProvider} from '@nomiclabs/buidler/internal/hardhat-network/provider/provider';
import {defaultHardhatNetworkParams} from '@nomiclabs/buidler/internal/core/config/default-config';
import {HARDHAT_NETWORK_NAME} from '@nomiclabs/buidler/plugins';

export {RecordedCall};

const {
  allowUnlimitedContractSize,
  blockGasLimit,
  chainId,
  hardfork,
  loggingEnabled,
  throwOnCallFailures,
  throwOnTransactionFailures
} = defaultHardhatNetworkParams;

function toHardhatGenesisAccounts(accounts: typeof defaultAccounts) {
  return accounts.map(({balance, secretKey}) => ({balance, privateKey: secretKey}))
}

interface MockProviderOptions {
  ganacheOptions: Ganache.IProviderOptions;
}

export class MockProvider extends providers.Web3Provider {
  private _callHistory: CallHistory
  private _ens?: ENS;

  constructor(private options?: MockProviderOptions) {
    super(new HardhatNetworkProvider(
      hardfork,
      HARDHAT_NETWORK_NAME,
      chainId,
      chainId,
      blockGasLimit,
      throwOnTransactionFailures,
      throwOnCallFailures,
      toHardhatGenesisAccounts(defaultAccounts),
      undefined,
      loggingEnabled,
      allowUnlimitedContractSize
    ));
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
