import { assert } from 'chai';
import {BigNumber, BigNumberish, providers, utils} from 'ethers';
import { BlockWithTransactions} from '@ethersproject/abstract-provider';
import {Simulator} from './simulator';

async function noBlockTag(blockTag: any) {
  if (await blockTag) {
    throw new Error('Not implemented: blockTag');
  }
}

export class GethProvider extends providers.Provider {
  sim: Simulator

  constructor() {
    super();
    this.sim = new Simulator();
  }

  async call(
    transaction: utils.Deferrable<providers.TransactionRequest>,
    blockTag?: providers.BlockTag | Promise<providers.BlockTag>
  ): Promise<string> {
    await noBlockTag(blockTag);
    const tx = await utils.resolveProperties(transaction)

    assert(tx.to, 'transaction.to is required');
    return this.sim.call({
      from: tx.from,
      to: tx.to!,
      gas: tx.gasLimit ? BigNumber.from(tx.gasLimit).toNumber() : undefined,
      gasPrice: tx.gasPrice ? BigNumber.from(tx.gasPrice).toHexString() : undefined,
      // gasFeeCap: BigNumber.from(tx.gasFeeCap).toHexString(),
      // gasTipCap: BigNumber.from(tx.gasTipCap).toHexString(),
      value: tx.value ? BigNumber.from(tx.value).toHexString() : undefined,
      data: tx.data ? BigNumber.from(tx.data).toHexString() : undefined,
    })!;
  }

  emit(eventName: providers.EventType, ...args: Array<any>): boolean {
    throw new Error('Not implemented');
  }

  estimateGas(transaction: utils.Deferrable<providers.TransactionRequest>): Promise<BigNumber> {
    throw new Error('Not implemented');
  }

  async getBalance(
    addressOrName: string | Promise<string>,
    blockTag?: providers.BlockTag | Promise<providers.BlockTag>
  ): Promise<BigNumber> {
    await noBlockTag(blockTag);
    const address = await addressOrName;
    if (!utils.isAddress(address)) {
      throw new Error('Not implemented: ENS');
    }
    return BigNumber.from(this.sim.getBalance(address));
  }

  async getBlock(blockHashOrBlockTag: providers.BlockTag | string | Promise<providers.BlockTag | string>): Promise<providers.Block> {
    const block = this.sim.getBlock((await blockHashOrBlockTag).toString())
    const difficulty = BigNumber.from(block.difficulty)
    return {
      transactions: [], // TODO
      difficulty: difficulty.toNumber(),
      _difficulty: difficulty,
      extraData: '',
      gasLimit: BigNumber.from(block.gasLimit),
      gasUsed: BigNumber.from(block.gasUsed),
      hash: block.hash,
      miner: block.miner,
      nonce: block.nonce,
      number: BigNumber.from(block.number).toNumber(),
      parentHash: block.parentHash,
      timestamp: BigNumber.from(block.timestamp).toNumber(),
      baseFeePerGas: BigNumber.from(block.baseFeePerGas)
    }
  }

  getBlockNumber(): Promise<number> {
    return Promise.resolve(Number.parseInt(this.sim.getBlockNumber()));
  }

  getBlockWithTransactions(
    blockHashOrBlockTag: providers.BlockTag | string | Promise<providers.BlockTag | string>
  ): Promise<BlockWithTransactions> {
    throw new Error('Not implemented');
  }

  async getCode(addressOrName: string | Promise<string>, blockTag?: providers.BlockTag | Promise<providers.BlockTag>): Promise<string> {
    return this.sim.getCode(await addressOrName);
  }

  async getGasPrice(): Promise<BigNumber> {
    return BigNumber.from(8000000);
  }

  async getLogs(filter: providers.Filter): Promise<providers.Log[]> {
    throw new Error('Not implemented');
  }

  getNetwork(): Promise<providers.Network> {
    const network: providers.Network = {
      name: 'undefined',
      chainId: Number.parseInt(this.sim.getChainID())
    };
    return Promise.resolve(network);
  }

  getStorageAt(
    addressOrName: string | Promise<string>,
    position: BigNumberish | Promise<BigNumberish>,
    blockTag?: providers.BlockTag | Promise<providers.BlockTag>
  ): Promise<string> {
    throw new Error('Not implemented');
  }

  async getTransaction(transactionHash: string): Promise<providers.TransactionResponse> {
    const {Tx} = this.sim.getTransaction(transactionHash);
    return {
      hash: Tx.hash,
      to: Tx.to,
      nonce: Number.parseInt(Tx.nonce, 16),

      gasLimit: BigNumber.from(Tx.gas),
      // TODO
      // gasPrice: BigNumber.from(Tx.gasPrice),

      data: Tx.input,
      value: BigNumber.from(Tx.value),
      chainId: Number.parseInt(this.sim.getChainID(), 16),

      // TODO
      // r: Tx.r,
      // s: Tx.s,
      // v: Tx.v,

      confirmations: 0,
      from: '0x',
      wait: () => { throw new Error('Not implemented'); }
    };
  }

  async getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: providers.BlockTag | Promise<providers.BlockTag>
  ): Promise<number> {
    return this.sim.getTransactionCount(await addressOrName);
  }

  getTransactionReceipt(transactionHash: string): Promise<providers.TransactionReceipt> {
    throw new Error('Not implemented');
  }

  listenerCount(eventName?: providers.EventType): number {
    throw new Error('Not implemented');
  }

  listeners(eventName?: providers.EventType): Array<providers.Listener> {
    throw new Error('Not implemented');
  }

  lookupAddress(address: string | Promise<string>): Promise<string> {
    throw new Error('Not implemented');
  }

  off(eventName: providers.EventType, listener?: providers.Listener): providers.Provider {
    throw new Error('Not implemented');
  }

  on(eventName: providers.EventType, listener: providers.Listener): providers.Provider {
    throw new Error('Not implemented');
  }

  once(eventName: providers.EventType, listener: providers.Listener): providers.Provider;
  once(eventName: 'block', handler: () => void): void;
  once(eventName: providers.EventType | 'block', listener: providers.Listener | (() => void)): providers.Provider | void {
    throw new Error('Not implemented');
  }

  removeAllListeners(eventName?: providers.EventType): providers.Provider {
    throw new Error('Not implemented');
  }

  async resolveName(name: string | Promise<string>): Promise<string> {
    return name;
  }

  async sendTransaction(signedTransaction: string | Promise<string>): Promise<providers.TransactionResponse> {
    const data = await signedTransaction;
    const receipt = this.sim.sendTransaction(data)

    const ethersReceipt: providers.TransactionReceipt & providers.TransactionResponse = {
      to: 'TODO',
      from: 'TODO',
      nonce: 0, // TODO

      gasLimit: BigNumber.from(0), // TODO
      gasPrice: BigNumber.from(0), // TODO

      data: '0x', // TODO
      value: BigNumber.from(0), // TODO
      chainId: 1337, // TODO

      // r?: string,
      // s?: string,
      // v?: number,

      // Typed-Transaction features
      // type?: number | null,

      // EIP-2930; Type 1 & EIP-1559; Type 2
      // accessList?: AccessList,

      // EIP-1559; Type 2
      // maxPriorityFeePerGas?: BigNumber,
      // maxFeePerGas?: BigNumber,
      hash: receipt.txHash,

      // Only if a transaction has been mined
      blockNumber: BigNumber.from(receipt.blockNumber).toNumber(),
      blockHash: receipt.blockHash,
      // timestamp?: number,
  
      confirmations: 1,
  
      // Not optional (as it is in Transaction)
  
      // The raw transaction
      raw: data,
  
      // This function waits until the transaction has been mined
      wait: async (confirmations?: number) => ethersReceipt,

    
      contractAddress: receipt.contractAddress,
      transactionIndex: receipt.transactionIndex,
      // root?: string,
      gasUsed: BigNumber.from(receipt.gasUsed),
      logsBloom: 'TODO',
      transactionHash: receipt.txHash,
      logs: [], // TODO
      cumulativeGasUsed: BigNumber.from(receipt.cumulativeGasUsed),
      effectiveGasPrice: BigNumber.from(10000), // TODO
      byzantium: true,
      type: receipt.type,
      status: receipt.status,
    };

    return ethersReceipt;
  }

  waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<providers.TransactionReceipt> {
    throw new Error('Not implemented');
  }
}
