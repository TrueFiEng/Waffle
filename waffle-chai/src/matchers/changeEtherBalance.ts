import type {TestProvider} from '@ethereum-waffle/provider';
import {BigNumber, BigNumberish, providers} from 'ethers';
import {callPromise} from '../call-promise';
import {ensure} from './calledOnContract/utils';
import {Account, getAddressOf} from './misc/account';
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
    }).then(([actualChange, address]: [BigNumber, string]) => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      const margin = options?.errorMargin ? options.errorMargin : '0';
      if (BigNumber.from(margin).eq(0)) {
        this.assert(
          actualChange.eq(BigNumber.from(balanceChange)),
          `Expected "${address}" to change balance by ${balanceChange} wei, ` +
            `but it has changed by ${actualChange} wei`,
          `Expected "${address}" to not change balance by ${balanceChange} wei,`,
          balanceChange,
          actualChange
        );
      } else {
        const low = BigNumber.from(balanceChange).sub(margin);
        const high = BigNumber.from(balanceChange).add(margin);
        this.assert(
          actualChange.lte(high) &&
          actualChange.gte(low),
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
  txResponse: providers.TransactionResponse,
  account: Account,
  options?: BalanceChangeOptions
) {
  ensure(account.provider !== undefined, TypeError, 'Provider not found');
  const txReceipt = await txResponse.wait();
  const txBlockNumber = txReceipt.blockNumber;
  const address = await getAddressOf(account);

  const balanceAfter = await account.provider.getBalance(address, txBlockNumber);
  const balanceBefore = await account.provider.getBalance(address, txBlockNumber - 1);

  if (options?.includeFee !== true && address === txReceipt.from) {
    const gasPrice = txResponse.gasPrice ?? txReceipt.effectiveGasPrice;
    const gasUsed = txReceipt.gasUsed;
    const txFee = gasPrice.mul(gasUsed);
    const provider = account.provider as TestProvider;
    if (typeof provider.getL1Fee === 'function') {
      const l1Fee = await provider.getL1Fee(txReceipt.transactionHash);
      return balanceAfter.add(txFee).add(l1Fee).sub(balanceBefore);
    }

    return balanceAfter.add(txFee).sub(balanceBefore);
  } else {
    return balanceAfter.sub(balanceBefore);
  }
}
