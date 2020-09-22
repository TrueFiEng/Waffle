import {BigNumber} from 'ethers';
import {Account, getAddressOf, getBalanceOf} from './misc/account';

export function supportChangeBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalance', function (
    this: any,
    signer: Account,
    balanceChange: any
  ) {
    const subject = this._obj;
    if (typeof subject !== 'function') {
      throw new Error(`Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalance('0xa', -200)`);
    }
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
  transactionCallback: () => any,
  account: Account
) {
  const balanceBefore = await getBalanceOf(account);
  await transactionCallback();
  const balanceAfter = await getBalanceOf(account);

  return balanceAfter.sub(balanceBefore);
}
