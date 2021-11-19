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
import {call, getBalance, getBlockNumber, sendTransaction, getChainID, getTransactionCount} from './native';
import { resolveProperties } from '@ethersproject/properties';

async function noBlockTag(blockTag: any) {
  if (await blockTag) {
    throw new Error('Not implemented: blockTag');
  }
}

export class GethProvider extends providers.Provider {
  async call(
    transaction: utils.Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    await noBlockTag(blockTag);
    return call(await resolveProperties(transaction))!;
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
    return BigNumber.from(getBalance(address));
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

  async getGasPrice(): Promise<BigNumber> {
    return BigNumber.from(8000000)
  }

  getLogs(filter: Filter): Promise<Array<Log>> {
    throw new Error('Not implemented');
  }

  getNetwork(): Promise<Network> {
    const network: Network = {
      name: 'undefined',
      chainId: Number.parseInt(getChainID()),
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
    throw new Error('Not implemented');
  }

  getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<number> {
    return getTransactionCount(addressOrName)
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

  async sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse> {
    const data = await signedTransaction;
    sendTransaction(data);
    // TODO use getTransaction
    return null as any;
  }

  waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt> {
    throw new Error('Not implemented');
  }
}
