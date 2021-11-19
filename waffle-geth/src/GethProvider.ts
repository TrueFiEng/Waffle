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
import {getBlockNumber} from './native';

export class GethProvider extends providers.Provider {
  call(transaction: utils.Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> {
    throw new Error('Not implemented');
  }

  emit(eventName: EventType, ...args: Array<any>): boolean {
    throw new Error('Not implemented');
  }

  estimateGas(transaction: utils.Deferrable<TransactionRequest>): Promise<BigNumber> {
    throw new Error('Not implemented');
  }

  getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber> {
    throw new Error('Not implemented');
  }

  getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block> {
    throw new Error('Not implemented');
  }

  getBlockNumber(): Promise<number> {
    return Promise.resolve(Number.parseInt(getBlockNumber()));
  }

  getBlockWithTransactions(
    blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>
  ): Promise<BlockWithTransactions> {
    throw new Error('Not implemented');
  }

  getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string> {
    throw new Error('Not implemented');
  }

  getGasPrice(): Promise<BigNumber> {
    throw new Error('Not implemented');
  }

  getLogs(filter: Filter): Promise<Array<Log>> {
    throw new Error('Not implemented');
  }

  getNetwork(): Promise<Network> {
    throw new Error('Not implemented');
  }

  getStorageAt(
    addressOrName: string | Promise<string>,
    position: BigNumberish | Promise<BigNumberish>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    throw new Error('Not implemented');
  }

  getTransaction(transactionHash: string): Promise<TransactionResponse> {
    throw new Error('Not implemented');
  }

  getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<number> {
    throw new Error('Not implemented');
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

  resolveName(name: string | Promise<string>): Promise<string> {
    throw new Error('Not implemented');
  }

  sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse> {
    throw new Error('Not implemented');
  }

  waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt> {
    throw new Error('Not implemented');
  }
}
