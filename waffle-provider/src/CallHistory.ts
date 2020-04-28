import {providers, utils} from 'ethers';

export interface RecordedCall {
  readonly address: string | undefined;
  readonly data: string;
}

export class CallHistory {
  private recordedCalls: RecordedCall[] = []

  clear() {
    this.recordedCalls = [];
  }

  getCalls() {
    return this.recordedCalls;
  }

  record(provider: providers.Web3Provider) {
    addVmListener(provider, 'beforeMessage', (message) => {
      this.recordedCalls.push(toRecordedCall(message));
    });
  }
}

function addVmListener(
  provider: providers.Web3Provider,
  event: string,
  handler: (value: any) => void
) {
  // FIXME: this is bad (remove .upstream)
  const {blockchain} = (provider._web3Provider as any).upstream.engine.manager.state;
  const createVMFromStateTrie = blockchain.createVMFromStateTrie;
  blockchain.createVMFromStateTrie = function (...args: any[]) {
    const vm = createVMFromStateTrie.apply(this, args);
    vm.on(event, handler);
    return vm;
  };
}

function toRecordedCall(message: any): RecordedCall {
  return {
    address: message.to ? utils.getAddress(utils.hexlify(message.to)) : undefined,
    data: message.data ? utils.hexlify(message.data) : '0x'
  };
}
