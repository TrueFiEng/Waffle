import {Wallet, BigNumber} from 'ethers';

export function supportChangeBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalances', function (
    this: any,
    wallets: Wallet[],
    balanceChanges: any[]
  ) {
    const subject = this._obj;
    if (typeof subject !== 'function') {
      throw new Error(`Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalances(['0xa', '0xb'], [-200, 200])`);
    }
    const derivedPromise = getBalanceChanges(subject, wallets).then(
      (actualChanges) => {
        const walletsAddresses = wallets.map((wallet) => wallet.address);
        this.assert(
          actualChanges.every((change, ind) =>
            change.eq(BigNumber.from(balanceChanges[ind]))
          ),
          `Expected ${walletsAddresses} to change balance by ${balanceChanges} wei, ` +
            `but it has changed by ${actualChanges} wei`,
          `Expected ${walletsAddresses} to not change balance by ${balanceChanges} wei,`,
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

async function getBalanceChanges(
  transactionCallback: () => any,
  wallets: Wallet[]
) {
  const balancesBefore = await Promise.all(
    wallets.map((wallet) => wallet.getBalance())
  );
  await transactionCallback();
  const balancesAfter = await Promise.all(
    wallets.map((wallet) => wallet.getBalance())
  );
  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}
