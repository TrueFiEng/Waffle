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
       * We use it to intercept `CALL` opcodes,
       * and track a history of internal calls between smart contracts.
       */
      (provider as any).on('ganache:vm:tx:step', (args: any) => {
        try {
          if (args.data.opcode.name === 'CALL') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, max-len
            const [gas, addr, value, argsOffset, argsLength, retOffset, retLength]: Buffer[] = [...args.data.stack].reverse(); // Source: ethervm.io

            const calldata = args.data.memory
              .slice(decodeNumber(argsOffset), decodeNumber(argsOffset) + decodeNumber(argsLength));
            callHistory.recordedCalls.push(toRecordedCall({
              to: addr,
              data: calldata
            }));
          }
        } catch (err) {
          console.log(err);
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
           * - `eth_sendRawTransaction` - a transaction,
           * - `eth_estimateGas` - gas estimation, typically precedes `eth_sendRawTransaction`.
           */
          if (method === 'eth_call') { // Record a query.
            callHistory.recordedCalls.push(toRecordedCall(args[0]?.params?.[0]));
          } else if (method === 'eth_sendRawTransaction') { // Record a transaction.
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
    address: message.to ? utils.getAddress(utils.hexlify(message.to)) : undefined,
    data: message.data ? utils.hexlify(message.data) : '0x'
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
