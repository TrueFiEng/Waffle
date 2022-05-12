import {BigNumber, BigNumberish, providers} from 'ethers';
import {transactionPromise} from '../transaction-promise';
import {getAddressOf, Account} from './misc/account';
import {BalanceChangeOptions, getAddresses, getBalances} from './misc/balance';

export function supportChangeEtherBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeEtherBalances', function (
    this: any,
    accounts: Account[],
    balanceChanges: BigNumberish[],
    options: BalanceChangeOptions
  ) {
    transactionPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.txPromise.then(() => {
      return Promise.all([
        getBalanceChanges(this.txResponse, accounts, options),
        getAddresses(accounts)
      ]);
    }).then(([actualChanges, accountAddresses]: [BigNumber[], string[]]) => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      this.assert(
        actualChanges.every((change, ind) =>
          change.eq(BigNumber.from(balanceChanges[ind]))
        ),
        `Expected ${accountAddresses} to change balance by ${balanceChanges} wei, ` +
          `but it has changed by ${actualChanges} wei`,
        `Expected ${accountAddresses} to not change balance by ${balanceChanges} wei,`,
        balanceChanges.map((balanceChange) => balanceChange.toString()),
        actualChanges.map((actualChange) => actualChange.toString())
      );
      this.__flags.negate = isCurrentlyNegated;
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.txPromise = derivedPromise;
    return this;
  });
}

export async function getBalanceChanges(
  txResponse: providers.TransactionResponse,
  accounts: Account[],
  options: BalanceChangeOptions
) {
  const txReceipt = await txResponse.wait();
  const txBlockNumber = txReceipt.blockNumber;

  const balancesAfter = await getBalances(accounts, txBlockNumber);
  const balancesBefore = await getBalances(accounts, txBlockNumber - 1);

  const txFees = await getTxFees(accounts, txResponse, options);

  return balancesAfter.map((balance, ind) => balance.add(txFees[ind]).sub(balancesBefore[ind]));
}

async function getTxFees(
  accounts: Account[],
  txResponse: providers.TransactionResponse,
  options: BalanceChangeOptions
) {
  return Promise.all(
    accounts.map(async (account) => {
      if (options?.includeFee !== true && await getAddressOf(account) === txResponse.from) {
        const txReceipt = await txResponse.wait();
        const gasPrice = txResponse.gasPrice ?? txReceipt.effectiveGasPrice;
        const gasUsed = txReceipt.gasUsed;
        const txFee = gasPrice.mul(gasUsed);
        const provider = account.provider as any;
        if (typeof provider.getL1Fee === 'function') {
          const l1Fee = await provider.getL1Fee(txReceipt.transactionHash);
          return txFee.add(l1Fee);
        }

        return txFee;
      }

      return 0;
    })
  );
}
