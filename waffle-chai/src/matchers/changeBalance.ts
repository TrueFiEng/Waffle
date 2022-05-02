import {BigNumber, BigNumberish} from 'ethers';
import {Account, getAddressOf} from './misc/account';
import {getBalanceChange} from './changeEtherBalance';
import {transactionPromise} from '../transaction-promise';

export function supportChangeBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalance', function (
    this: any,
    account: Account,
    balanceChange: BigNumberish
  ) {
    transactionPromise(this);
    const derivedPromise = new Promise<[BigNumber, string]>((resolve, reject) => {
      Promise.all([
        this.txPromise.then(() => {
          return this.txResponse;
        }),
        getAddressOf(account)
      ]).then(([txResponse, address]) => {
        getBalanceChange(txResponse, account, {includeFee: true}).then(actualChanges => {
          resolve([actualChanges, address]);
        }).catch(reject);
      }).catch(reject);
    }).then(
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
    this.txPromise = derivedPromise;
    return this;
  });
}
