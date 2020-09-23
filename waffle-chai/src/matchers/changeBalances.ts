import {BigNumber, providers} from 'ethers';
import {ensure} from './calledOnContract/utils';
import {getAddressOf, Account} from './misc/account';

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
  if (typeof transaction === 'function') {
    const balancesBefore = await getBalances(signers);
    await transaction();
    const balancesAfter = await getBalances(signers);

    return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
  } else {
    const transactionBlockNumber = (await transaction.wait()).blockNumber;

    const balancesAfter = await getBalances(signers, transactionBlockNumber);
    const balancesBefore = await getBalances(signers, transactionBlockNumber - 1);

    return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
  }
}

function getAddresses(signers: Account[]) {
  return Promise.all(signers.map((signer) => getAddressOf(signer)));
}

async function getBalances(signers: Account[], blockNumber?: number) {
  return Promise.all(
    signers.map((signer) => {
      ensure(signer.provider !== undefined, TypeError, 'Provider not found');
      if (blockNumber) {
        return signer.provider.getBalance(getAddressOf(signer), blockNumber);
      } else {
        return signer.provider.getBalance(getAddressOf(signer));
      }
    })
  );
}
