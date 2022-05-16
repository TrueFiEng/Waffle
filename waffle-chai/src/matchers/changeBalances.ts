import {BigNumber, BigNumberish} from 'ethers';
import {callPromise} from '../call-promise';
import {getBalanceChanges} from './changeEtherBalances';
import {Account} from './misc/account';
import {getAddresses} from './misc/balance';

export function supportChangeBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalances', function (
    this: any,
    accounts: Account[],
    balanceChanges: BigNumberish[]
  ) {
    callPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.callPromise.then(() => {
      if (!('txResponse' in this)) {
        throw new Error('The changeBalances matcher must be called on a transaction');
      }
      return Promise.all([
        getBalanceChanges(this.txResponse, accounts, {includeFee: true}),
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
    this.callPromise = derivedPromise;
    return this;
  });
}
