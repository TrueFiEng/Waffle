import type {RecordedCall} from '@ethereum-waffle/provider';
import {utils} from 'ethers';

/**
 * Injects call history into hardhat provider,
 * making it possible to use matchers like calledOnContract
 */

class CallHistory {
  recordedCalls: RecordedCall[] = [];

  addUniqueCall(call: RecordedCall) {
    if (!this.recordedCalls.find(c => c.address === call.address && c.data === call.data)) {
      this.recordedCalls.push(call);
    }
  }

  clearAll() {
    this.recordedCalls = [];
  }
}

function toRecordedCall(message: any): RecordedCall {
  return {
    address: message.to?.buf ? utils.getAddress(utils.hexlify(message.to.buf)) : undefined,
    data: message.data ? utils.hexlify(message.data) : '0x'
  };
}

const inject = () => {
  let waffle: any;
  try {
    waffle = require('hardhat')?.waffle;
  } catch { return; }
  if (!waffle || !waffle.provider) return;
  const callHistory = new CallHistory();
  (waffle.provider as any).clearCallHistory = () => {
    callHistory.clearAll();
  };

  let beforeMessageListener: (message: any) => void | undefined;
  const init = waffle.provider?._hardhatNetwork?.provider?._wrapped?._wrapped?._wrapped?._init;
  if (!init) return;
  waffle.provider._hardhatNetwork.provider._wrapped._wrapped._wrapped._init = async function () {
    await init.apply(this);
    if (typeof beforeMessageListener === 'function') {
      // has to be here because of weird behaviour of init function, which requires us to re-register the handler.
      getHardhatVMEventEmitter(waffle)?.off?.('beforeMessage', beforeMessageListener);
    }
    beforeMessageListener = (message: any) => {
      callHistory.addUniqueCall(toRecordedCall(message));
    };
    waffle.provider.callHistory = callHistory.recordedCalls;
    getHardhatVMEventEmitter(waffle)?.on?.('beforeMessage', beforeMessageListener);
  };
};

let injected = false;
if (!injected && !!process.env.WAFFLE_EXPERIMENTAL_HARDHAT_CALL_HISTORY) {
  injected = true;
  inject();
}

function getHardhatVMEventEmitter(waffle: any) {
  const vm = waffle.provider
    ?._hardhatNetwork.provider
    ?._wrapped._wrapped
    ?._wrapped
    ?._node
    ?._vmTracer
    ?._vm;

  /**
   * There were changes related to the location of event emitter introduced
   * in Hardhat version 2.11.0.
   */
  return vm?.evm?.events ?? vm;
}
