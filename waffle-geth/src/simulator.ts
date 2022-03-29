import type {TransactionRequest, Filter} from '@ethersproject/abstract-provider';

const library = require('../rust-nj/dist/index.node');

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
    return library.getBlockNumber(this.id)!;
  }

  call(msg: TransactionRequest): string {
    return '0x' + library.call(this.id, JSON.stringify(msg));
  }

  getBalance(address: string): string {
    return library.getBalance(this.id, address)!;
  }

  sendTransaction(data: string): string {
    return library.sendTransaction(this.id, data)!;
  }

  getChainID(): string {
    return library.getChainID(this.id)!;
  }

  getTransactionCount(address: string): number {
    return library.getTransactionCount(this.id, address);
  }

  getLogs(filter: Filter): string {
    return library.getLogs(this.id, JSON.stringify(filter))!
  }

  getCode(address: string): string {
    return `0x${library.getCode(this.id, address)!}`;
  }

  getTransaction(hash: string): string {
    return library.getTransaction(this.id, hash)!;
  }
}

