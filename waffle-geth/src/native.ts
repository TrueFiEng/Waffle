import ffi from 'ffi-napi';
import {join} from 'path';
import type {TransactionRequest} from '@ethersproject/abstract-provider';

export const library = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  cgoCurrentMillis: ['int', []],
  newSimulator: ['int', []],
  getBlockNumber: ['string', ['int']],
  getChainID: ['string', ['int']],
  sendTransaction: ['string', ['int', 'string']],
  getBalance: ['string', ['int', 'string']],
  call: ['string', ['int', 'string']],
  getTransactionCount: ['int', ['int', 'string']]
});

const id = newSimulator()

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function newSimulator(): number {
  return library.newSimulator();
}

export function getBlockNumber(): string {
  return library.getBlockNumber(id);
}

export function call(msg: TransactionRequest) {
  return '0x' + library.call(id, JSON.stringify(msg))
}

export function getBalance(address: string): string {
  return library.getBalance(id, address);
}

export function sendTransaction(data: string): string {
  const res = library.sendTransaction(id, data);
  console.log(res)
  return res
}

export function getChainID(): string {
  return library.getChainID()!;
}

export function getTransactionCount(address: string): number {
  return library.getTransactionCount(id, address);
}
