import {waffle} from 'hardhat';
import {RecordedCall} from 'ethereum-waffle';
import {utils} from 'ethers';

class CallHistory {
  recordedCalls: RecordedCall[] = [];

  addUniqueCall(call: RecordedCall) {
    if (!this.recordedCalls.find(c => c.address === call.address && c.data === call.data)) {
      this.recordedCalls.push(call);
    }
  }

  clearAll () {
    this.recordedCalls = [];
  }
}

function toRecordedCall(message: any): RecordedCall {
  return {
    address: message.to?.buf ? utils.getAddress(utils.hexlify(message.to.buf)) : undefined,
    data: message.data ? utils.hexlify(message.data) : '0x'
  }
}

const callHistory = new CallHistory();
(waffle.provider as any).clearCallHistory = () => {
  callHistory.clearAll();
}

let beforeMessageListener: (message: any) => void | undefined

const init = (waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._init;
(waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._init = async function () {
  await init.apply(this)
  if (typeof beforeMessageListener === 'function') {
    (waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._node._vmTracer._vm.off("beforeMessage", beforeMessageListener);
  }
  beforeMessageListener = (message: any) => {
    callHistory.addUniqueCall(toRecordedCall(message));
  }
  const provider: any = waffle.provider
  provider.callHistory = callHistory.recordedCalls;
  (waffle.provider as any)._hardhatNetwork.provider._wrapped._wrapped._wrapped._node._vmTracer._vm.on("beforeMessage", beforeMessageListener);
}
