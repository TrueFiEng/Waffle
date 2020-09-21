import {BigNumber, providers} from 'ethers';
import {Account, getAddressOf, getBalanceOf} from './misc/account';

export function supportChangeBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalance', function (
    this: any,
    signer: Account,
    balanceChange: any
  ) {
    const subject = this._obj;
    const derivedPromise = Promise.all([
      getBalanceChange(subject, signer),
      getAddressOf(signer)
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

export async function getBalanceChange(
  transaction: providers.TransactionResponse | Function,
  account: Account
) {
  if (transaction instanceof Function) {
    const balanceBefore = await getBalanceOf(account);
    await transaction();
    const balanceAfter = await getBalanceOf(account);

    return balanceAfter.sub(balanceBefore);
  } else {
    const transactionBlockNumber = (await transaction.wait()).blockNumber;

    const balanceAfter = await getBalanceOf(account, transactionBlockNumber);
    const balanceBefore = await getBalanceOf(account, transactionBlockNumber - 1);

    return balanceAfter.sub(balanceBefore);
  }
}
