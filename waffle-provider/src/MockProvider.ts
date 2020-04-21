import {utils, providers, Wallet} from 'ethers';
import {defaultAccounts} from './defaultAccounts';
import Ganache from 'ganache-core';

interface VMOpcodeEmitter {
  on(event: 'vm_step', listener: (step: VMStep) => void): providers.Provider;
}

export interface VMStep {
  pc: number;
  gasLeft: utils.BigNumber;
  opcode: {
    name: string;
    fee: number;
    isAsync: boolean;
  };
  stack: utils.BigNumber[];
  depth: number;
  address: Buffer;
  account: object;
  stateManager: object;
  memory: number[];
  memoryWordCount: utils.BigNumber;
}

const defaults = {accounts: defaultAccounts};

export class MockProvider extends providers.Web3Provider implements VMOpcodeEmitter {
  constructor(private options?: Ganache.IProviderOptions) {
    super(Ganache.provider({...defaults, ...options}) as any);
    this._patchVmOpcodes();
  }

  getWallets() {
    const items = this.options?.accounts ?? defaults.accounts;
    return items.map((x: any) => new Wallet(x.secretKey, this));
  }

  createEmptyWallet() {
    return Wallet.createRandom().connect(this);
  }

  private _patchVmOpcodes() {
    const emit = (step: VMStep) => this.emit('vm_step', step);
    const {blockchain} = (this._web3Provider as any).engine.manager.state;
    const createVMFromStateTrie = blockchain.createVMFromStateTrie;
    blockchain.createVMFromStateTrie = function (...args: any[]) {
      const vm = createVMFromStateTrie.apply(this, args);
      vm.on('step', emit);
      return vm;
    };
  }
}
