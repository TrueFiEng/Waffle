import {BigNumber, BigNumberish, providers} from 'ethers';
import {ensure} from './calledOnContract/utils';
import {Account, getAddressOf} from './misc/account';

export function supportChangeBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalance', function (
    this: any,
    account: Account,
    balanceChange: BigNumberish
  ) {
    const subject = this._obj;
    const derivedPromise = Promise.all([
      getBalanceChange(subject, account),
      getAddressOf(account)
    ]).then(
      ([actualChange, address]) => {
        this.assert(
          actualChange.eq(BigNumber.from(balanceChange)),
          `Expected "${address}" to change balance by ${balanceChange} wei, ` +
          `but it has changed by ${actualChange} wei`,
          `Expected "${address}" to not change balance by ${balanceChange} wei,`,
          balanceChange,
          actualChange
        );
      }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.promise = derivedPromise;
    return this;
  });
}

async function getBalanceChange(
  transaction: providers.TransactionResponse | (() => Promise<void> | void),
  account: Account
) {
  if (typeof transaction === 'function') {
    return getBalanceChangeForTransactionCall(transaction, account);
  } else {
    return getBalanceChangeForTransactionResponse(transaction, account);
  }
}

async function getBalanceChangeForTransactionCall(transactionCall: (() => Promise<void> | void), account: Account) {
  ensure(account.provider !== undefined, TypeError, 'Provider not found');

  const balanceBefore = await account.provider.getBalance(getAddressOf(account));
  await transactionCall();
  const balanceAfter = await account.provider.getBalance(getAddressOf(account));

  return balanceAfter.sub(balanceBefore);
}

async function getBalanceChangeForTransactionResponse(
  transactionResponse: providers.TransactionResponse,
  account: Account
) {
  ensure(account.provider !== undefined, TypeError, 'Provider not found');

  const transactionBlockNumber = (await transactionResponse.wait()).blockNumber;

  const balanceAfter = await account.provider.getBalance(getAddressOf(account), transactionBlockNumber);
  const balanceBefore = await account.provider.getBalance(getAddressOf(account), transactionBlockNumber - 1);

  return balanceAfter.sub(balanceBefore);
}
