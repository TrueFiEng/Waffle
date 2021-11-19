import {BigNumber, BigNumberish, providers, utils} from 'ethers';
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
import type {Network} from '@ethersproject/networks';
import {Simulator} from './native';
import { resolveProperties } from '@ethersproject/properties';

async function noBlockTag(blockTag: any) {
  if (await blockTag) {
    throw new Error('Not implemented: blockTag');
  }
}

export class GethProvider extends providers.Provider {
  sim: Simulator

  constructor() {
    super()
    this.sim = new Simulator()
  }

  async call(
    transaction: utils.Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    await noBlockTag(blockTag);
    return this.sim.call(await resolveProperties(transaction))!;
  }

  emit(eventName: EventType, ...args: Array<any>): boolean {
    throw new Error('Not implemented');
  }

  estimateGas(transaction: utils.Deferrable<TransactionRequest>): Promise<BigNumber> {
    throw new Error('Not implemented');
  }

  async getBalance(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<BigNumber> {
    await noBlockTag(blockTag);
    const address = await addressOrName;
    if (!utils.isAddress(address)) {
      throw new Error('Not implemented: ENS');
    }
    return BigNumber.from(this.sim.getBalance(address));
  }

  getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block> {
    throw new Error('Not implemented');
  }

  getBlockNumber(): Promise<number> {
    return Promise.resolve(Number.parseInt(this.sim.getBlockNumber()));
  }

  getBlockWithTransactions(
    blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>
  ): Promise<BlockWithTransactions> {
    throw new Error('Not implemented');
  }

  async getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> {
    return this.sim.getCode(await addressOrName)
  }

  async getGasPrice(): Promise<BigNumber> {
    return BigNumber.from(8000000);
  }

  async getLogs(filter: Filter): Promise<Log[]> {
    return JSON.parse(this.sim.getLogs(filter))
  }

  getNetwork(): Promise<Network> {
    const network: Network = {
      name: 'undefined',
      chainId: Number.parseInt(this.sim.getChainID())
    };
    return Promise.resolve(network);
  }

  getStorageAt(
    addressOrName: string | Promise<string>,
    position: BigNumberish | Promise<BigNumberish>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    throw new Error('Not implemented');
  }

  getTransaction(transactionHash: string): Promise<TransactionResponse> {
    const {Tx} = JSON.parse(this.sim.getTransaction(transactionHash));
    return Tx;
  }

  async getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<number> {
    return this.sim.getTransactionCount(await addressOrName);
  }

  getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt> {
    throw new Error('Not implemented');
  }

  listenerCount(eventName?: EventType): number {
    throw new Error('Not implemented');
  }

  listeners(eventName?: EventType): Array<Listener> {
    throw new Error('Not implemented');
  }

  lookupAddress(address: string | Promise<string>): Promise<string> {
    throw new Error('Not implemented');
  }

  off(eventName: EventType, listener?: Listener): Provider {
    throw new Error('Not implemented');
  }

  on(eventName: EventType, listener: Listener): Provider {
    throw new Error('Not implemented');
  }

  once(eventName: EventType, listener: Listener): Provider;

  once(eventName: 'block', handler: () => void): void;
  once(eventName: EventType | 'block', listener: Listener | (() => void)): Provider | void {
    throw new Error('Not implemented');
  }

  removeAllListeners(eventName?: EventType): Provider {
    throw new Error('Not implemented');
  }

  async resolveName(name: string | Promise<string>): Promise<string> {
    return name;
  }

  async sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse> {
    const data = await signedTransaction;
    const result = JSON.parse(this.sim.sendTransaction(data));
    return {
      hash: result.transactionHash,
      blockNumber: Number.parseInt(result.blockNumber, 16),
      blockHash: result.blockHash,
      timestamp: undefined,
      confirmations: 0,
      from: '0x',
      wait: () => { throw new Error('Not implemented'); },
      nonce: 0,
      gasLimit: BigNumber.from(0),
      gasPrice: BigNumber.from(0),
      data: '0x',
      value: BigNumber.from(0),
      chainId: 1
    };
  }

  waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt> {
    throw new Error('Not implemented');
  }
}
