import {BigNumber, BigNumberish} from 'ethers';
import {getBalanceChanges} from './changeEtherBalances';
import {Account} from './misc/account';
import {getAddresses} from './misc/balance';

export function supportChangeBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalances', function (
    this: any,
    accounts: Account[],
    balanceChanges: BigNumberish[]
  ) {
    const subject = this._obj;

    const derivedPromise = Promise.all([
      getBalanceChanges(subject, accounts, {includeFee: true}),
      getAddresses(accounts)
    ]).then(
      ([actualChanges, accountAddresses]) => {
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
      }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.promise = derivedPromise;
    return this;
  });
}
