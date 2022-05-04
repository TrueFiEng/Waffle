import {BigNumber, BigNumberish, Contract, providers} from 'ethers';
import {transactionPromise} from '../transaction-promise';
import {Account, getAddressOf} from './misc/account';

export function supportChangeTokenBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalances', function (
    this: any,
    token: Contract,
    accounts: Account[],
    balanceChanges: BigNumberish[]
  ) {
    transactionPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.txPromise.then(async () => {
      const addresses = await getAddresses(accounts);
      const actualChanges = await getBalanceChanges(this.txReceipt, token, addresses);
      return [actualChanges, addresses];
    }).then(([actualChanges, accountAddresses]: [BigNumber[], string[]]) => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
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
      this.__flags.negate = isCurrentlyNegated;
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.txPromise = derivedPromise;
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
