import {BigNumber, BigNumberish} from 'ethers';
import {Account, getAddressOf} from './misc/account';
import {getBalanceChange} from './changeEtherBalance';

export function supportChangeBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalance', function (
    this: any,
    account: Account,
    balanceChange: BigNumberish
  ) {
    const subject = this._obj;
    const derivedPromise = Promise.all([
      getBalanceChange(subject, account, {includeFee: true}),
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
