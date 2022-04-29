import {BigNumber, BigNumberish, Contract, providers} from 'ethers';
import { transactionPromise } from '../transaction-promise';
import {Account, getAddressOf} from './misc/account';

type TransactionResponse = providers.TransactionResponse;

export function supportChangeTokenBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalances', function (
    this: any,
    token: Contract,
    accounts: Account[],
    balanceChanges: BigNumberish[]
  ) {
    transactionPromise(this);
    const derivedPromise = new Promise<[BigNumber[], string[]]>((resolve, reject) => {
      Promise.all([
        this.promise.then(() => {
          const txReceipt: providers.TransactionReceipt = this.receipt;
          return txReceipt
        }),
        getAddresses(accounts)
      ]).then(([txReceipt, addresses]) => {
        getBalanceChanges(txReceipt, token, addresses).then(actualChanges => {
          resolve([actualChanges, addresses]);
        }).catch(reject);
      }).catch(reject);
    }).then(
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

async function getBalances(token: Contract, addresses: string[], blockNumber: number) {
  return Promise.all(
    addresses.map((address) => {
      return token['balanceOf(address)'](address, {blockTag: blockNumber});
    })
  );
}

async function getBalanceChanges(
  txReceipt: providers.TransactionReceipt,
  token: Contract,
  addresses: string[]
) {
  const txBlockNumber = txReceipt.blockNumber;

  const balancesBefore = await getBalances(token, addresses, txBlockNumber - 1);
  const balancesAfter = await getBalances(token, addresses, txBlockNumber);

  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}
