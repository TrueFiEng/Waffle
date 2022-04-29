import {BigNumber, BigNumberish, Contract, providers} from 'ethers';
import {Account, getAddressOf} from './misc/account';

type TransactionResponse = providers.TransactionResponse;

export function supportChangeTokenBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalances', function (
    this: any,
    token: Contract,
    accounts: Account[],
    balanceChanges: BigNumberish[]
  ) {
    const subject = this._obj;
    const derivedPromise = Promise.all([
      getBalanceChanges(subject, token, accounts),
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

function getAddresses(accounts: Account[]) {
  return Promise.all(accounts.map((account) => getAddressOf(account)));
}

async function getBalances(token: Contract, accounts: Account[], blockNumber: number) {
  return Promise.all(
    accounts.map(async (account) => {
      return token['balanceOf(address)'](getAddressOf(account), {blockTag: blockNumber});
    })
  );
}

async function getBalanceChanges(
  transaction: (() => Promise<TransactionResponse> | TransactionResponse) | TransactionResponse,
  token: Contract,
  accounts: Account[]
) {
  let txResponse: TransactionResponse;

  if (typeof transaction === 'function') {
    txResponse = await transaction();
  } else {
    txResponse = transaction;
  }
  const txReceipt = await txResponse.wait();
  const txBlockNumber = txReceipt.blockNumber;

  const balancesBefore = await getBalances(token, accounts, txBlockNumber - 1);
  const balancesAfter = await getBalances(token, accounts, txBlockNumber);

  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}
