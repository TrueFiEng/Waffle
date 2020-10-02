import {BigNumber, BigNumberish, providers} from 'ethers';
import {ensure} from './calledOnContract/utils';
import {getAddressOf, Account} from './misc/account';

export function supportChangeBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeBalances', function (
    this: any,
    accounts: Account[],
    balanceChanges: BigNumberish[]
  ) {
    const subject = this._obj;

    const derivedPromise = Promise.all([
      getBalanceChanges(subject, accounts),
      getAddresses(accounts)
    ]).then(
      ([actualChanges, accountAddresses]) => {
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
    return getBalanceChangesForTransactionCall(transaction, accounts);
  } else {
    return getBalanceChangesForTransactionResponse(transaction, accounts);
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

async function getBalanceChangesForTransactionCall(transactionCall: (() => Promise<void> | void), accounts: Account[]) {
  const balancesBefore = await getBalances(accounts);
  await transactionCall();
  const balancesAfter = await getBalances(accounts);

  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}

async function getBalanceChangesForTransactionResponse(
  transactionResponse: providers.TransactionResponse,
  accounts: Account[]
) {
  const transactionBlockNumber = (await transactionResponse.wait()).blockNumber;

  const balancesAfter = await getBalances(accounts, transactionBlockNumber);
  const balancesBefore = await getBalances(accounts, transactionBlockNumber - 1);

  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}
