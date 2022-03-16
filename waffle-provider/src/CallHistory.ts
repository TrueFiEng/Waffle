import {utils} from 'ethers';
import type {Provider} from 'ganache';

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

  record(provider: Provider): Provider {
    const callHistory = this;

    const ganacheProviderProxy = new Proxy(provider, {
      get(target, prop, receiver) {
        const original = (target as any)[prop as any];
        if (typeof original !== 'function') {
          return original;
        }
        return function (...args: any[]) {
          const result = original.apply(target, args);
          if (prop === 'request') {
            const method = args[0]?.method;
            // console.log('we have a request');
            // console.log(JSON.stringify(args));
            if (method === 'eth_call') {
              // Gas estimate is followed by a `eth_sendRawTransaction`.
              // It is easier to decode gas estimation args than decode eth_sendRawTransaction
              callHistory.recordedCalls.push(toRecordedCall(args[0]?.params?.[0]));
              // console.log('its a call');
              // console.log(prop, JSON.stringify(args) + ' -> ' + JSON.stringify(result));
            } else if (method === 'eth_sendRawTransaction') {
              console.log('raw tx')
              const parsedTx = parseTransaction(args[0]?.params?.[0]);
              callHistory.recordedCalls.push(toRecordedCall(parsedTx));
            }
          } else if (prop !== 'request') {
            // console.log('different prop: ', prop);
            // console.log(JSON.stringify(args));
          }

          return result;
        };
      }
    });

    return ganacheProviderProxy;

    // addVmListener(provider, 'beforeMessage', (message) => {
    //   this.recordedCalls.push(toRecordedCall(message));
    // });
  }
}

function addVmListener(
  provider: Provider,
  event: string,
  handler: (value: any) => void
) {

  // const prov: any = provider.provider;

  // console.log({prov});
  // prov.on('ganache:vm:tx:before', (...args: any[]) => {
  //   console.log('ganache:vm:tx:before')
  //   console.log(args)
  // });
  // prov.on('ganache:vm:tx:step', (...args: any[]) => {
  //   console.log('ganache:vm:tx:step')
  //   console.log(args)
  // });
  // prov.on('ganache:vm:tx:after', (...args: any[]) => {
  //   console.log('ganache:vm:tx:after')
  //   console.log(args)
  // });

  // provider = new Proxy(provider, {
  //   get(target, prop, receiver) {
  //     console.log('prop: ', prop)
  //   }
  // })

  // const {blockchain} = prov.engine.manager.state;
  // const createVMFromStateTrie = blockchain.createVMFromStateTrie;
  // blockchain.createVMFromStateTrie = function (...args: any[]) {
  //   const vm = createVMFromStateTrie.apply(this, args);
  //   vm.on(event, handler);
  //   return vm;
  // };
}

function toRecordedCall(message: any): RecordedCall {
  return {
    address: message.to ? utils.getAddress(utils.hexlify(message.to)) : undefined,
    data: message.data ? utils.hexlify(message.data) : '0x'
  };
}
