import ffi from 'ffi-napi';
import {join} from 'path';
import type {TransactionRequest} from '@ethersproject/abstract-provider';
import {utils} from 'ethers';

export const library = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  cgoCurrentMillis: ['int', []],
  getBlockNumber: ['string', []],
  sendTransaction: ['void', ['string']],
  getBalance: ['string', ['string']],
  call: ['string', ['string']]
});

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function getBlockNumber(): string {
  return library.getBlockNumber();
}

export function call(msg: utils.Deferrable<TransactionRequest>): string {
  return library.call(JSON.stringify({
    From: msg.from, //      common.Address  // the sender of the 'transaction'
    To: msg.to, //        *common.Address // the destination contract (nil for contract creation)
    Gas: msg.gasLimit?.toString(), //       uint64          // if 0, the call executes with near-infinite gas
    GasPrice: msg.gasPrice?.toString(), //  *big.Int        // wei <-> gas exchange ratio
    GasFeeCap: undefined, // *big.Int        // EIP-1559 fee cap per gas.
    GasTipCap: undefined, // *big.Int        // EIP-1559 tip per gas.
    Value: msg.value?.toString(), //     *big.Int        // amount of wei sent along with the call
    Data: msg.data //      []byte          // input data, usually an ABI-encoded contract method invocation
    // AccessList:     // types.AccessList // EIP-2930 access list.
  }));
}
export function getBalance(address: string): string {
  return library.getBalance(address);
}

export function sendTransaction(data: string): void {
  return library.sendTransaction(data);
}
