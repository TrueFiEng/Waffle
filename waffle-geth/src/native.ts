import ffi from 'ffi-napi' ;
import {join} from 'path';
import type {
  Block,
  BlockTag,
  BlockWithTransactions,
  EventType,
  TransactionRequest,
  TransactionResponse,
  Log,
  TransactionReceipt,
  Filter,
  Listener,
  Provider
} from '@ethersproject/abstract-provider';

export const library = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  cgoCurrentMillis: ['int', []],
  getBlockNumber: ['string', []],
  sendTransaction: ['void', ['string']],
  getBalance: ['string', ['string']],
  call: ['string', ['string']],
});

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function getBlockNumber(): string {
  return library.getBlockNumber();
}

export function call(msg: TransactionRequest) {
  return library.call(JSON.stringify({
    From: undefined,     //      common.Address  // the sender of the 'transaction'
    To: undefined,     //        *common.Address // the destination contract (nil for contract creation)
    Gas: undefined,     //       uint64          // if 0, the call executes with near-infinite gas
    GasPrice: undefined,     //  *big.Int        // wei <-> gas exchange ratio
    GasFeeCap: undefined,     // *big.Int        // EIP-1559 fee cap per gas.
    GasTipCap: undefined,     // *big.Int        // EIP-1559 tip per gas.
    Value: undefined,     //     *big.Int        // amount of wei sent along with the call
    Data: msg.data,     //      []byte          // input data, usually an ABI-encoded contract method invocation
    // AccessList:     // types.AccessList // EIP-2930 access list.
  }))
}
export function getBalance(address: string): string {
  return library.getBalance(address);
}

export function sendTransaction(data: string): void {
  return library.sendTransaction(data);
}
