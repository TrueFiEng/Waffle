import type {TestProvider} from '@ethereum-waffle/provider';
import {type BigNumberish, type TransactionResponse} from 'ethers';
import {callPromise} from '../call-promise';
import {getAddressOf, Account} from './misc/account';
import {BalanceChangeOptions, getAddresses, getBalances} from './misc/balance';

export function supportChangeEtherBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeEtherBalances', function (
    this: any,
    accounts: Account[],
    balanceChanges: BigNumberish[],
    options: BalanceChangeOptions
  ) {
    callPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.callPromise.then(() => {
      if (!('txResponse' in this)) {
        throw new Error('The changeEtherBalances matcher must be called on a transaction');
      }
      if (accounts.some(account => typeof account === 'string')) {
        throw new Error(
          'A string address cannot be used as an account in changeEtherBalances.' +
          ' Expecting an instance of Ethers Account.'
        );
      }
      return Promise.all([
        getBalanceChanges(this.txResponse, accounts, options),
        getAddresses(accounts)
      ]);
    }).then(([actualChanges, accountAddresses]: [bigint[], string[]]) => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      const margin = options?.errorMargin ? options.errorMargin : '0';
      if (BigInt(margin) === BigInt(0)) {
        this.assert(
          actualChanges.every((change, ind) =>
            change <= (BigInt(balanceChanges[ind]) + BigInt(margin)) &&
            change >= (BigInt(balanceChanges[ind]) - BigInt(margin))
          ),
          `Expected ${accountAddresses} to change balance by ${balanceChanges} wei, ` +
            `but it has changed by ${actualChanges} wei`,
          `Expected ${accountAddresses} to not change balance by ${balanceChanges} wei,`,
          balanceChanges.map((balanceChange) => balanceChange.toString()),
          actualChanges.map((actualChange) => actualChange.toString())
        );
      } else {
        actualChanges.forEach((change, ind) => {
          const low = BigInt(balanceChanges[ind]) - BigInt(margin);
          const high = BigInt(balanceChanges[ind]) + BigInt(margin);
          this.assert(
            change <= high &&
            change >= low,
            `Expected "${accountAddresses[ind]}" balance to change within [${[low, high]}] wei, ` +
              `but it has changed by ${change} wei`,
            `Expected "${accountAddresses[ind]}" balance to not change within [${[low, high]}] wei`,
            balanceChanges[ind],
            change
          );
        });
      }
      this.__flags.negate = isCurrentlyNegated;
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.callPromise = derivedPromise;
    return this;
  });
}

export async function getBalanceChanges(
  txResponse: TransactionResponse,
  accounts: Account[],
  options: BalanceChangeOptions
) {
  const txReceipt = await txResponse.wait();
  const txBlockNumber = txReceipt?.blockNumber;

  const balancesAfter = await getBalances(accounts, txBlockNumber);
  const balancesBefore = await getBalances(accounts, txBlockNumber - 1);

  const txFees = await getTxFees(accounts, txResponse, options);

  return balancesAfter.map((balance, ind) => balance.add(txFees[ind]).sub(balancesBefore[ind]));
}

async function getTxFees(
  accounts: Account[],
  txResponse: TransactionResponse,
  options: BalanceChangeOptions
) {
  return Promise.all(
    accounts.map(async (account) => {
      if (options?.includeFee !== true && await getAddressOf(account) === txResponse.from) {
        const txReceipt = await txResponse.wait();
        const gasPrice = txResponse.gasPrice ?? txReceipt.effectiveGasPrice;
        const gasUsed = txReceipt.gasUsed;
        const txFee = gasPrice * gasUsed;
        const provider = account.provider as TestProvider;
        if (typeof provider.getL1Fee === 'function') {
          const l1Fee = await provider.getL1Fee(txReceipt.transactionHash) ;
          return txFee + l1Fee;
        }

        return txFee;
      }

      return 0;
    })
  );
}
