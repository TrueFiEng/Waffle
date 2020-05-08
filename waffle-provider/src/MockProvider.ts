import {providers, Wallet} from 'ethers';
import {CallHistory, RecordedCall} from './CallHistory';
import {defaultAccounts} from './defaultAccounts';
import Ganache from 'ganache-core';
import {RevertLocalizer} from './RevertLocalizer';
import {GanacheWrapper} from './GanacheWrapper';

export {RecordedCall};

export class MockProvider extends providers.Web3Provider {
  private _callHistory: CallHistory;
  private _revertLocalizer: RevertLocalizer;

  constructor(private options?: Ganache.IProviderOptions) {
    super(new GanacheWrapper({accounts: defaultAccounts, ...options}));
    const wrapper = this.provider as GanacheWrapper;
    this._callHistory = new CallHistory();
    this._callHistory.record(wrapper);
    this._revertLocalizer = new RevertLocalizer(this);
    this._revertLocalizer.interceptCalls(wrapper);
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
