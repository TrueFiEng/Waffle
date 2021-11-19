import ffi from 'ffi-napi';
import {join} from 'path';
import type {TransactionRequest, Filter} from '@ethersproject/abstract-provider';
import {utils} from 'ethers';

export const library = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  cgoCurrentMillis: ['int', []],
  getBlockNumber: ['string', []],
  getChainID: ['string', []],
  sendTransaction: ['string', ['string']],
  getBalance: ['string', ['string']],
  call: ['string', ['string']],
  getTransactionCount: ['int', ['string']],
  getLogs: ['string', ['string']]
});

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function getBlockNumber(): string {
  return library.getBlockNumber();
}

export function call(msg: TransactionRequest) {
  return '0x' + library.call(JSON.stringify(msg))
}
export function getBalance(address: string): string {
  return library.getBalance(address);
}

export function sendTransaction(data: string): string {
  return library.sendTransaction(data);
}

export function getChainID(): string {
  return library.getChainID()!;
}

export function getTransactionCount(address: string): number {
  return library.getTransactionCount(address);
}

export function getLogs(filter: Filter): string[] {
  return library.getLogs(JSON.stringify(filter))
}
