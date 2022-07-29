import {BigNumber, BigNumberish, Contract, providers} from 'ethers';
import {callPromise} from '../call-promise';
import {Account, getAddressOf} from './misc/account';

export function supportChangeTokenBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalance', function (
    this: any,
    token: Contract,
    account: Account | string,
    balanceChange: BigNumberish
  ) {
    callPromise(this);
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.callPromise.then(async () => {
      if (!('txReceipt' in this)) {
        throw new Error('The changeTokenBalance matcher must be called on a transaction');
      }
      const address = typeof account === 'string' ? account : await getAddressOf(account);
      const actualChanges = await getBalanceChange(this.txReceipt, token, address);
      return [actualChanges, address];
    }).then(([actualChange, address]: [BigNumber, string]) => {
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
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.callPromise = derivedPromise;
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
