import {BigNumber, BigNumberish, Contract, providers} from 'ethers';
import {Account, getAddressOf} from './misc/account';

export function supportChangeTokenBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalance', function (
    this: any,
    token: Contract,
    account: Account,
    balanceChange: BigNumberish
  ) {
    const subject = this._obj;
    const derivedPromise = Promise.all([
      getBalanceChange(subject, token, account),
      getAddressOf(account)
    ]).then(
      ([actualChange, address]) => {
        this.assert(
          actualChange.eq(BigNumber.from(balanceChange)),
          `Expected "${address}" to change balance by ${balanceChange} wei, ` +
          `but it has changed by ${actualChange} wei`,
          `Expected "${address}" to not change balance by ${balanceChange} wei,`,
          balanceChange,
          actualChange
        );
      }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.promise = derivedPromise;
    return this;
  });
}

async function getBalanceChange(
  transaction: (() => Promise<providers.TransactionResponse> | providers.TransactionResponse) | providers.TransactionResponse,
  token: Contract,
  account: Account
) {
  let txResponse: providers.TransactionResponse;

  if (typeof transaction === 'function') {
    txResponse = await transaction();
  } else {
    txResponse = transaction;
  }
  const txReceipt = await txResponse.wait();
  const txBlockNumber = txReceipt.blockNumber;

  const balanceBefore: BigNumber = await token['balanceOf(address)'](await getAddressOf(account), { blockTag: txBlockNumber - 1 });
  const balanceAfter: BigNumber = await token['balanceOf(address)'](await getAddressOf(account), { blockTag: txBlockNumber });

  return balanceAfter.sub(balanceBefore);
}
