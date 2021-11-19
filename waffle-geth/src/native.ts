import ffi from 'ffi-napi';
import {join} from 'path';
import type {TransactionRequest, Filter} from '@ethersproject/abstract-provider';
import {utils} from 'ethers';

export const library = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  cgoCurrentMillis: ['int', []],
  newSimulator: ['int', []],
  getBlockNumber: ['string', ['int']],
  getChainID: ['string', ['int']],
  sendTransaction: ['string', ['int', 'string']],
  getBalance: ['string', ['int', 'string']],
  call: ['string', ['int', 'string']],
  getTransactionCount: ['int', ['int', 'string']],
  getLogs: ['string', ['string']]
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
  return library.sendTransaction(data);
}

export function getChainID(): string {
  return library.getChainID()!;
}

export function getTransactionCount(address: string): number {
  return library.getTransactionCount(id, address);
}

export function getLogs(filter: Filter): string[] {
  return library.getLogs(JSON.stringify(filter))
}
