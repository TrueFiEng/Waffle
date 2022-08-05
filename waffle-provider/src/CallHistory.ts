import {utils} from 'ethers';
import {parseTransaction} from 'ethers/lib/utils';
import type {Provider} from 'ganache';

export interface RecordedCall {
  readonly address: string | undefined;
  readonly data: string;
}

/**
 * CallHistory gathers a log of queries and transactions
 * sent to a blockchain provider.
 * It is used by the `calledOnContract` matcher.
 */
export class CallHistory {
  private recordedCalls: RecordedCall[] = []

  clear() {
    this.recordedCalls = [];
  }

  getCalls() {
    return this.recordedCalls;
  }

  record(provider: Provider): Provider {
    // Required for the Proxy object.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const callHistory = this;

    /**
     * One needs to register any `ganache:*` event handler
     * after a `connect` event is emitted.
     * After that we can consider the provider to be initialized.
     * Otherwise some internal object might not have been created yet,
     * and there is a silently ignored error deep in ganache / ethereum VM.
     */
    (provider as any).on('connect', () => {
      /**
       * A single step over a single opcode inside the EVM.
       * We use it to intercept `CALL` and `STATICCALL` opcodes,
       * and track a history of internal calls between smart contracts.
       */
      (provider as any).on('ganache:vm:tx:step', (args: any) => {
        if (['CALL', 'STATICCALL'].includes(args.data.opcode.name)) {
          try {
            callHistory.recordedCalls.push(toRecordedCall(decodeCallData(args.data)));
          } catch (err) {
            console.log(err);
          }
        }
      });
    });

    /**
     * We override the ganache provider with a proxy,
     * that hooks into a `provider.request()` method.
     *
     * All other methods and properties are left intact.
     */
    return new Proxy(provider, {
      get(target, prop, receiver) {
        const original = (target as any)[prop as any];
        if (typeof original !== 'function') {
          // Some non-method property - returned as-is.
          return original;
        }
        // Return a function override.
        return function (...args: any[]) {
          // Get a function result from the original provider.
          const originalResult = original.apply(target, args);

          // Every method other than `provider.request()` left intact.
          if (prop !== 'request') return originalResult;

          const method = args[0]?.method;
          /**
           * A method can be:
           * - `eth_call` - a query to the node,
           * - `eth_sendRawTransaction` - a raw transaction,
           * - `eth_sendTransaction` - a transaction,
           * - `eth_estimateGas` - gas estimation, typically precedes `eth_sendRawTransaction`.
           */
          if (method === 'eth_call' || method === 'eth_sendTransaction') { // Record a query or a transaction.
            callHistory.recordedCalls.push(toRecordedCall(args[0]?.params?.[0]));
          } else if (method === 'eth_sendRawTransaction') { // Record a raw transaction.
            const parsedTx = parseTransaction(args[0]?.params?.[0]);
            callHistory.recordedCalls.push(toRecordedCall(parsedTx));
          }
          return originalResult;
        };
      }
    });
  }
}

function toRecordedCall(message: any): RecordedCall {
  return {
    address: message.to ? decodeAddress(message.to) : undefined,
    data: message.data ? utils.hexlify(message.data) : '0x'
  };
}

/**
 * Decodes the arguments of CALLs and STATICCALLs taken from a traced step in EVM execution.
 * Source of the arguments: ethervm.io
 */
function decodeCallData(callData: any) {
  let addr: Buffer, argsOffset: Buffer, argsLength: Buffer;
  if (callData.opcode.name === 'CALL') {
    [, addr, , argsOffset, argsLength] = [...callData.stack].reverse();
  } else if (callData.opcode.name === 'STATICCALL') {
    [, addr, argsOffset, argsLength] = [...callData.stack].reverse();
  } else {
    throw new Error(`Unsupported call type for decoding call data: ${callData.opcode.name}`);
  }

  const decodedCallData = callData.memory
    .slice(decodeNumber(argsOffset), decodeNumber(argsOffset) + decodeNumber(argsLength));

  return {
    to: addr,
    data: decodedCallData
  };
}

/**
 * Decodes a number taken from EVM execution step
 * into a JS number.
 */
function decodeNumber(data: Buffer): number {
  const newData = Buffer.concat([data, Buffer.alloc(32, 0)]);
  return newData.readUInt32LE();
}

/**
 * Decodes a address taken from EVM execution step
 * into a checksumAddress.
 */
function decodeAddress(data: Buffer): string {
  if (data.length < 20) {
    data = Buffer.concat([Buffer.alloc(20 - data.length, 0), data]);
  }
  return utils.getAddress(utils.hexlify(data));
}
