const library = require('../rust-nj/dist/index.node');

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function newSimulator(): number {
  return library.newSimulator();
}

// This type is declared in rust bindings.
export interface TransactionReceipt {
  type: number,
  status: number,
  cumulativeGasUsed: number,
  txHash: string,
  contractAddress: string,
  gasUsed: number,
  blockHash: string,
  blockNumber: string,
  transactionIndex: number,
}

// This type is declared in rust bindings.
export interface TransactionRequest {
  from?: string,
  to: string,
  gas?: number,
  gasPrice?: string,
  gasFeeCap?: string,
  gasTipCap?: string,
  value?: string,
  data?: string,
}

export interface Block {
  parentHash: string,
  sha3Uncles: string,
  miner: string,
  stateRoot: string,
  transactionsRoot: string,
  receiptsRoot: string,
  logsBloom: string,
  difficulty: string,
  number: string,
  gasLimit: string,
  gasUsed: string,
  timestamp: string,
  extraData: string,
  mixHash: string,
  nonce: string,
  baseFeePerGas: string,
  hash: string
}

export interface Transaction {
  Tx: {
    type: string,
    nonce: string,
    gasPrice: null | string,
    maxPriorityFeePerGas: null | string,
    maxFeePerGas: null | string,
    gas: string,
    value: string,
    input: string,
    v: string,
    r: string,
    s: string,
    to: string,
    hash: string
  },
  IsPending: boolean
}

export class Simulator {
  id: number

  constructor() {
    this.id = newSimulator()
  }


  getBlockNumber(): string {
    return library.getBlockNumber(this.id)!;
  }

  getBlock(blockHashOrTag: string): Block {
    return JSON.parse(library.getBlock(this.id, blockHashOrTag)!);
  }

  call(msg: TransactionRequest): string {
    return '0x' + library.call(this.id, {
      from: '',
      gas: 0,
      gasPrice: '',
      gasFeeCap: '',
      gasTipCap: '',
      value: '',
      data: '0x',
      ...msg,
    });
  }

  getBalance(address: string): string {
    return library.getBalance(this.id, address)!;
  }

  sendTransaction(data: string): TransactionReceipt {
    return library.sendTransaction(this.id, data)!;
  }

  getChainID(): string {
    return library.getChainId(this.id)!;
  }

  getTransactionCount(address: string): number {
    return library.getTransactionCount(this.id, address);
  }

  // getLogs(filter: Filter): string {
  //   return library.getLogs(this.id, JSON.stringify(filter))!
  // }

  getCode(address: string): string {
    return `0x${library.getCode(this.id, address)!}`;
  }

  getTransaction(hash: string): Transaction {
    return JSON.parse(library.getTransaction(this.id, hash)!);
  }
}

