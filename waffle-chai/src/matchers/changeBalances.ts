import {BigNumber, BigNumberish} from 'ethers';
import {transactionPromise} from '../transaction-promise';
import {getBalanceChanges} from './changeEtherBalances';
import {Account} from './misc/account';
import {getAddresses} from './misc/balance';

export function supportChangeBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalances', function (
    this: any,
    accounts: Account[],
    balanceChanges: BigNumberish[]
  ) {
    transactionPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = new Promise<[BigNumber[], string[]]>((resolve, reject) => {
      Promise.all([
        this.txPromise.then(() => {
          return this.txResponse;
        }),
        getAddresses(accounts)
      ]).then(([txResponse, addresses]) => {
        getBalanceChanges(txResponse, accounts, {includeFee: true}).then(actualChanges => {
          resolve([actualChanges, addresses]);
        }).catch(reject);
      }).catch(reject);
    }).then(
      ([actualChanges, accountAddresses]) => {
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
      }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.txPromise = derivedPromise;
    return this;
  });
}
