import {providers, Wallet} from 'ethers';
import {CallHistory, RecordedCall} from './CallHistory';
import {defaultAccounts} from './defaultAccounts';
import Ganache from 'ganache-core';
import {DebugProvider} from './DebugProvider';

export {RecordedCall};

export class MockProvider extends providers.Web3Provider {
  private _callHistory: CallHistory;

  constructor(private options?: Ganache.IProviderOptions) {
    super(new DebugProvider(Ganache.provider({accounts: defaultAccounts, ...options}) as any));
    this._callHistory = new CallHistory();
    this._callHistory.record(this);
  }

  getWallets() {
    const items = this.options?.accounts ?? defaultAccounts;
    return items.map((x: any) => new Wallet(x.secretKey, this));
  }

  createEmptyWallet() {
    return Wallet.createRandom().connect(this);
  }

  set buildDir(value: string) {
    (this._web3Provider as DebugProvider).buildDir = value;
  }

  clearCallHistory() {
    this._callHistory.clear();
  }

  get callHistory(): readonly RecordedCall[] {
    return this._callHistory.getCalls();
  }
}
