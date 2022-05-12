import {BigNumber, BigNumberish} from 'ethers';
import {Account, getAddressOf} from './misc/account';
import {getBalanceChange} from './changeEtherBalance';
import {callPromise} from '../call-promise';

export function supportChangeBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalance', function (
    this: any,
    account: Account,
    balanceChange: BigNumberish
  ) {
    callPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.callPromise.then(() => {
      if (!('txResponse' in this)) {
        throw new Error('The changeBalance matcher must be called on a transaction');
      }
      return Promise.all([
        getBalanceChange(this.txResponse, account, {includeFee: true}),
        getAddressOf(account)
      ]);
    }).then(([actualChange, address]: [BigNumber, string]) => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      this.assert(
        actualChange.eq(BigNumber.from(balanceChange)),
        `Expected "${address}" to change balance by ${balanceChange} wei, ` +
        `but it has changed by ${actualChange} wei`,
        `Expected "${address}" to not change balance by ${balanceChange} wei,`,
        balanceChange,
        actualChange
      );
      this.__flags.negate = isCurrentlyNegated;
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.callPromise = derivedPromise;
    return this;
  });
}
