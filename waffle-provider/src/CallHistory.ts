import {utils} from 'ethers';
import {GanacheWrapper} from './GanacheWrapper';

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

  record(wrapper: GanacheWrapper) {
    addVmListener(wrapper, 'beforeMessage', (message) => {
      this.recordedCalls.push(toRecordedCall(message));
    });
  }
}

function addVmListener(
  wrapper: GanacheWrapper,
  event: string,
  handler: (value: any) => void
) {
  const {blockchain} = wrapper.provider.engine.manager.state;
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
