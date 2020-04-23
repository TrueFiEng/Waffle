import {providers, Wallet, utils} from 'ethers';
import {defaultAccounts} from './defaultAccounts';
import Ganache from 'ganache-core';

const defaults = {accounts: defaultAccounts};

export interface RecordedCall {
  readonly address: string;
  readonly data: string;
}

export class MockProvider extends providers.Web3Provider {
  private _callHistory: RecordedCall[] = []

  constructor(private options?: Ganache.IProviderOptions) {
    super(Ganache.provider({...defaults, ...options}) as any);
    this.recordCallHistory();
  }

  private recordCallHistory() {
    const onMessage = (message: any) => {
      this._callHistory.push({
        address: message.to && utils.getAddress(utils.hexlify(message.to)),
        data: message.data && utils.hexlify(message.data)
      });
    };
    const {blockchain} = (this._web3Provider as any).engine.manager.state;
    const createVMFromStateTrie = blockchain.createVMFromStateTrie;
    blockchain.createVMFromStateTrie = function (...args: any[]) {
      const vm = createVMFromStateTrie.apply(this, args);
      vm.on('beforeMessage', onMessage);
      return vm;
    };
  }

  getWallets() {
    const items = this.options?.accounts ?? defaults.accounts;
    return items.map((x: any) => new Wallet(x.secretKey, this));
  }

  createEmptyWallet() {
    return Wallet.createRandom().connect(this);
  }

  clearCallHistory() {
    this._callHistory = [];
  }

  get callHistory(): readonly RecordedCall[] {
    return this._callHistory;
  }
}
