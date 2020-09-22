import {BigNumber} from 'ethers';
import {getBalanceOf, getAddressOf, Account} from './misc/account';

export function supportChangeBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalances', function (
    this: any,
    signers: Account[],
    balanceChanges: any[]
  ) {
    const subject = this._obj;
    if (typeof subject !== 'function') {
      throw new Error(`Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalances(['0xa', '0xb'], [-200, 200])`);
    }

    const derivedPromise = Promise.all([
      getBalanceChanges(subject, signers),
      getAddresses(signers)
    ]).then(
      ([actualChanges, signerAddresses]) => {
        this.assert(
          actualChanges.every((change, ind) =>
            change.eq(BigNumber.from(balanceChanges[ind]))
          ),
          `Expected ${signerAddresses} to change balance by ${balanceChanges} wei, ` +
            `but it has changed by ${actualChanges} wei`,
          `Expected ${signerAddresses} to not change balance by ${balanceChanges} wei,`,
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
  signers: Account[]
) {
  const balancesBefore = await Promise.all(
    signers.map(getBalanceOf)
  );
  await transactionCallback();
  const balancesAfter = await Promise.all(
    signers.map(getBalanceOf)
  );
  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}

function getAddresses(signers: Account[]) {
  return Promise.all(signers.map((signer) => getAddressOf(signer)));
}
