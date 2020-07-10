import {BigNumber, Signer} from 'ethers';

export function supportChangeBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalance', function (
    this: any,
    signer: Signer,
    balanceChange: any
  ) {
    const subject = this._obj;
    if (typeof subject !== 'function') {
      throw new Error(`Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalance('0xa', -200)`);
    }
    const derivedPromise = Promise.all([
      getBalanceChange(subject, signer),
      signer.getAddress()
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
  signer: Signer
) {
  const balanceBefore = await signer.getBalance();
  await transactionCallback();
  const balanceAfter = await signer.getBalance();
  return balanceAfter.sub(balanceBefore);
}
