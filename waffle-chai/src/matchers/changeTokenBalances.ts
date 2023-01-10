import {BigNumber, BigNumberish, Contract, providers} from 'ethers';
import {callPromise} from '../call-promise';
import {Account, getAddressOf} from './misc/account';

export function supportChangeTokenBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalances', function (
    this: any,
    token: Contract,
    accounts: (Account | string)[],
    balanceChanges: BigNumberish[],
    errorMargin: BigNumberish
  ) {
    callPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.callPromise.then(async () => {
      if (!('txReceipt' in this)) {
        throw new Error('The changeTokenBalances matcher must be called on a transaction');
      }
      const addresses = await getAddresses(accounts);
      const actualChanges = await getBalanceChanges(this.txReceipt, token, addresses);
      return [actualChanges, addresses];
    }).then(([actualChanges, accountAddresses]: [BigNumber[], string[]]) => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      if (errorMargin === undefined) errorMargin = '0';
      if (BigNumber.from(errorMargin).eq(0)) {
        this.assert(
          actualChanges.every((change, ind) =>
            change.lte(BigNumber.from(balanceChanges[ind]).add(errorMargin)) &&
            change.gte(BigNumber.from(balanceChanges[ind]).sub(errorMargin))
          ),
          `Expected ${accountAddresses} to change balance by ${balanceChanges} wei, ` +
            `but it has changed by ${actualChanges} wei`,
          `Expected ${accountAddresses} to not change balance by ${balanceChanges} wei,`,
          balanceChanges.map((balanceChange) => balanceChange.toString()),
          actualChanges.map((actualChange) => actualChange.toString())
        );
      } else {
        actualChanges.forEach((change, ind) => {
          const low = BigNumber.from(balanceChanges[ind]).sub(errorMargin);
          const high = BigNumber.from(balanceChanges[ind]).add(errorMargin);
          this.assert(
            change.lte(high) &&
            change.gte(low),
            `Expected "${accountAddresses[ind]}" balance to change within [${[low, high]}] wei, ` +
              `but it has changed by ${change} wei`,
            `Expected "${accountAddresses[ind]}" balance to not change within [${[low, high]}] wei`,
            balanceChanges[ind],
            change
          );
        });
      }
      this.__flags.negate = isCurrentlyNegated;
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.callPromise = derivedPromise;
    return this;
  });
}

function getAddresses(accounts: (Account | string)[]) {
  return Promise.all(accounts.map(
    (account) => typeof account === 'string' ? account : getAddressOf(account)
  ));
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
