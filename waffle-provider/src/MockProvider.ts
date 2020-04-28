import {providers, Wallet} from 'ethers';
import {CallHistory, RecordedCall} from './CallHistory';
import {defaultAccounts} from './defaultAccounts';
import Ganache from 'ganache-core';
import {RevertLocalizer} from './RevertLocalizer';

export {RecordedCall};

export class MockProvider extends providers.Web3Provider {
  private _callHistory: CallHistory;
  private _revertLocalizer: RevertLocalizer;

  constructor(private options?: Ganache.IProviderOptions) {
    super(Ganache.provider({accounts: defaultAccounts, ...options}) as any);
    this._callHistory = new CallHistory();
    this._callHistory.record(this);
    this._revertLocalizer = new RevertLocalizer();
    this._revertLocalizer.interceptCalls(this);
  }

  getWallets() {
    const items = this.options?.accounts ?? defaultAccounts;
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

  set buildDir(value: string) {
    this._revertLocalizer.buildDir = value;
  }
}
