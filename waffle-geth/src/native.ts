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
  getLogs: ['string', ['int', 'string']],
  getCode: ['string', ['int', 'string']]
});

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function newSimulator(): number {
  return library.newSimulator();
}

export class Simulator {
  id: number

  constructor() {
    this.id = newSimulator()
  }


  getBlockNumber(): string {
    return library.getBlockNumber(this.id);
  }

  call(msg: TransactionRequest) {
    return '0x' + library.call(this.id, JSON.stringify(msg));
  }

  getBalance(address: string): string {
    return library.getBalance(this.id, address);
  }

  sendTransaction(data: string): string {
    return library.sendTransaction(this.id, data);
  }

  getChainID(): string {
    return library.getChainID(this.id);
  }

  getTransactionCount(address: string): number {
    return library.getTransactionCount(this.id, address);
  }

  getLogs(filter: Filter): string[] {
    return library.getLogs(this.id, JSON.stringify(filter))
  }

  getCode(address: string): string {
    return `0x${library.getCode(this.id, address)!}`;
  }
}

