import {BigNumber, providers} from 'ethers';
import {getBalanceOf, getAddressOf, Account} from './misc/account';

export function supportChangeBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalances', function (
    this: any,
    signers: Account[],
    balanceChanges: any[]
  ) {
    const subject = this._obj;

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
  transaction: providers.TransactionResponse | (() => Promise<void> | void),
  signers: Account[]
) {
  if (transaction instanceof Function) {
    const balancesBefore = await Promise.all(
      signers.map((signer) => getBalanceOf(signer))
    );
    await transaction();
    const balancesAfter = await Promise.all(
      signers.map((signer) => getBalanceOf(signer))
    );

    return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
  } else {
    const transactionBlockNumber = (await transaction.wait()).blockNumber;

    const balancesAfter = await Promise.all(
      signers.map((signer) => getBalanceOf(signer, transactionBlockNumber))
    );
    const balancesBefore = await Promise.all(
      signers.map((signer) => getBalanceOf(signer, transactionBlockNumber - 1))
    );

    return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
  }
}

function getAddresses(signers: Account[]) {
  return Promise.all(signers.map((signer) => getAddressOf(signer)));
}
