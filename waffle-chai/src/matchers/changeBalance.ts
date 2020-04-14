import {Wallet, utils} from 'ethers';

export function supportChangeBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalance', function (this: any, wallet: Wallet, balanceChange: any) {
    const subject = this._obj;
    if (typeof subject !== 'function') {
      throw new Error(`Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalance('0xa', -200)`);
    }
    const derivedPromise = getBalanceChange(subject, wallet)
      .then((actualChange) => {
        this.assert(actualChange.eq(utils.bigNumberify(balanceChange)),
          `Expected "${wallet.address}" to change balance by ${balanceChange} wei, ` +
          `but it has changed by ${actualChange} wei`,
          `Expected "${wallet.address}" to not change balance by ${balanceChange} wei,`,
          balanceChange,
          actualChange);
      });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.promise = derivedPromise;
    return this;
  });
}

export async function getBalanceChange(transactionCallback: () => any, wallet: Wallet) {
  const balanceBefore = await wallet.getBalance();
  await transactionCallback();
  const balanceAfter = await wallet.getBalance();
  return balanceAfter.sub(balanceBefore);
}
