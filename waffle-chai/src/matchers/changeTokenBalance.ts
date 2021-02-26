import {BigNumber, BigNumberish, Contract} from 'ethers';
import {Account, getAddressOf} from './misc/account';

export function supportChangeTokenBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalance', function (
    this: any,
    token: Contract,
    account: Account,
    balanceChange: BigNumberish
  ) {
    const subject = this._obj;
    const derivedPromise = Promise.all([
      getBalanceChange(subject, token, account),
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
  transactionCall: (() => Promise<void> | void),
  token: Contract,
  account: Account
) {
  const balanceBefore: BigNumber = await token['balanceOf(address)'](await getAddressOf(account));
  await transactionCall();
  const balanceAfter: BigNumber = await token['balanceOf(address)'](await getAddressOf(account));

  return balanceAfter.sub(balanceBefore);
}
