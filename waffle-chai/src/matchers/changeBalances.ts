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
  accounts: Account[]
) {
  if (typeof transaction === 'function') {
    return getBalancesChangeForTransactionCall(transaction, accounts);
  } else {
    return getBalancesChangeForTransactionResponse(transaction, accounts);
  }
}

function getAddresses(accounts: Account[]) {
  return Promise.all(accounts.map((account) => getAddressOf(account)));
}

async function getBalances(accounts: Account[], blockNumber?: number) {
  return Promise.all(
    accounts.map((account) => {
      ensure(account.provider !== undefined, TypeError, 'Provider not found');
      if (blockNumber) {
        return account.provider.getBalance(getAddressOf(account), blockNumber);
      } else {
        return account.provider.getBalance(getAddressOf(account));
      }
    })
  );
}

async function getBalancesChangeForTransactionCall(transactionCall: (() => Promise<void> | void), accounts: Account[]) {
  const balancesBefore = await getBalances(accounts);
  await transactionCall();
  const balancesAfter = await getBalances(accounts);

  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}

async function getBalancesChangeForTransactionResponse(
  transactionResponse: providers.TransactionResponse,
  accounts: Account[]
) {
  const transactionBlockNumber = (await transactionResponse.wait()).blockNumber;

  const balancesAfter = await getBalances(accounts, transactionBlockNumber);
  const balancesBefore = await getBalances(accounts, transactionBlockNumber - 1);

  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}
