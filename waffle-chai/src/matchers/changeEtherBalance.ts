import type {TestProvider} from '@ethereum-waffle/provider';
import {BigNumberish, type TransactionResponse} from 'ethers';
import {callPromise} from '../call-promise';
import {ensure} from './calledOnContract/utils';
import {Account, getAddressOf, getProvider} from './misc/account';
import {BalanceChangeOptions} from './misc/balance';

export function supportChangeEtherBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeEtherBalance', function (
    this: any,
    account: Account,
    balanceChange: BigNumberish,
    options: BalanceChangeOptions
  ) {
    callPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.callPromise.then(() => {
      if (!('txResponse' in this)) {
        throw new Error('The changeEtherBalance matcher must be called on a transaction');
      }
      if (typeof account === 'string') {
        throw new Error(
          'A string address cannot be used as an account in changeEtherBalance.' +
          ' Expecting an instance of Ethers Account.'
        );
      }
      return Promise.all([
        getBalanceChange(this.txResponse, account, options),
        getAddressOf(account)
      ]);
    }).then(([actualChange, address]: [bigint, string]) => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      const margin = options?.errorMargin ? options.errorMargin : '0';
      if (BigInt(margin) === BigInt(0)) {
        this.assert(
          actualChange === BigInt(balanceChange),
          `Expected "${address}" to change balance by ${balanceChange} wei, ` +
            `but it has changed by ${actualChange} wei`,
          `Expected "${address}" to not change balance by ${balanceChange} wei,`,
          balanceChange,
          actualChange
        );
      } else {
        const low = BigInt(balanceChange) - BigInt(margin);
        const high = BigInt(balanceChange) + BigInt(margin);
        this.assert(
          actualChange <= high &&
          actualChange >= low,
          `Expected "${address}" balance to change within [${[low, high]}] wei, ` +
            `but it has changed by ${actualChange} wei`,
          `Expected "${address}" balance to not change within [${[low, high]}] wei`,
          balanceChange,
          actualChange
        );
      }
      this.__flags.negate = isCurrentlyNegated;
    }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.callPromise = derivedPromise;
    return this;
  });
}

export async function getBalanceChange(
  txResponse: TransactionResponse,
  account: Account,
  options?: BalanceChangeOptions
) {
  const provider = getProvider(account);
  ensure(provider !== undefined && provider !== null, TypeError, 'Provider not found');
  const txReceipt = await txResponse.wait();
  ensure(txReceipt !== null, Error, 'Transaction receipt not found')
  const txBlockNumber = txReceipt.blockNumber;
  const address = await getAddressOf(account);

  const balanceAfter = await provider.getBalance(address, txBlockNumber);
  const balanceBefore = await provider.getBalance(address, txBlockNumber - 1);

  if (options?.includeFee !== true && address === txReceipt.from) {
    const gasPrice = txResponse.gasPrice ?? txReceipt.cumulativeGasUsed;
    const gasUsed = txReceipt.gasUsed;
    const txFee = gasPrice * gasUsed;
    const provider = account.provider as TestProvider;
    if (typeof provider.getL1Fee === 'function') {
      const l1Fee = await provider.getL1Fee(txReceipt.hash);
      return balanceAfter + txFee + l1Fee - balanceBefore;
    }

    return balanceAfter + txFee - balanceBefore;
  } else {
    return balanceAfter - balanceBefore;
  }
}
