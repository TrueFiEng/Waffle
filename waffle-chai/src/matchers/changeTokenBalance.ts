import {BigNumber, BigNumberish, Contract, providers} from 'ethers';
import {transactionPromise} from '../transaction-promise';
import {Account, getAddressOf} from './misc/account';

export function supportChangeTokenBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalance', function (
    this: any,
    token: Contract,
    account: Account,
    balanceChange: BigNumberish
  ) {
    transactionPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = new Promise<[BigNumber, string]>((resolve, reject) => {
      Promise.all([
        this.txPromise.then(() => {
          return this.txReceipt;
        }),
        getAddressOf(account)
      ]).then(([txReceipt, address]) => {
        getBalanceChange(txReceipt, token, address).then(actualChange => {
          resolve([actualChange, address]);
        }).catch(reject);
      }).catch(reject);
    }).then(([actualChange, address]) => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      this.assert(
        actualChange.eq(BigNumber.from(balanceChange)),
        `Expected "${address}" to change balance by ${balanceChange} wei, ` +
          `but it has changed by ${actualChange} wei`,
        `Expected "${address}" to not change balance by ${balanceChange} wei,`,
        balanceChange,
        actualChange
      );
      this.__flags.negate = isCurrentlyNegated;
    }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.txPromise = derivedPromise;
    return this;
  });
}

async function getBalanceChange(
  txReceipt: providers.TransactionReceipt,
  token: Contract,
  address: string
) {
  const txBlockNumber = txReceipt.blockNumber;

  const balanceBefore: BigNumber = await token['balanceOf(address)'](
    address,
    {blockTag: txBlockNumber - 1}
  );
  const balanceAfter: BigNumber = await token['balanceOf(address)'](
    address,
    {blockTag: txBlockNumber}
  );

  return balanceAfter.sub(balanceBefore);
}
