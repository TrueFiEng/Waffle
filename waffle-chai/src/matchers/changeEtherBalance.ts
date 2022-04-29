import {BigNumber, BigNumberish, providers} from 'ethers';
import {transactionPromise} from '../transaction-promise';
import {ensure} from './calledOnContract/utils';
import {Account, getAddressOf} from './misc/account';
import {BalanceChangeOptions} from './misc/balance';

export function supportChangeEtherBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeEtherBalance', function (
    this: any,
    account: Account,
    balanceChange: BigNumberish,
    options: BalanceChangeOptions
  ) {
    transactionPromise(this);
    const derivedPromise = new Promise<[BigNumber, string]>((resolve, reject) => {
      Promise.all([
        this.promise.then(() => {
          return this.response;
        }),
        getAddressOf(account)
      ]).then(([txResponse, address]) => {
        getBalanceChange(txResponse, account, options).then(actualChanges => {
          resolve([actualChanges, address]);
        }).catch(reject);
      }).catch(reject);
    }).then(([actualChange, address]) => {
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

export async function getBalanceChange(
  txResponse: providers.TransactionResponse,
  account: Account,
  options?: BalanceChangeOptions
) {
  ensure(account.provider !== undefined, TypeError, 'Provider not found');
  const txReceipt = await txResponse.wait();
  const txBlockNumber = txReceipt.blockNumber;
  const address = await getAddressOf(account);

  const balanceAfter = await account.provider.getBalance(address, txBlockNumber);
  const balanceBefore = await account.provider.getBalance(address, txBlockNumber - 1);

  if (options?.includeFee !== true && address === txReceipt.from) {
    const gasPrice = txResponse.gasPrice ?? txReceipt.effectiveGasPrice;
    const gasUsed = txReceipt.gasUsed;
    const txFee = gasPrice.mul(gasUsed);

    return balanceAfter.add(txFee).sub(balanceBefore);
  } else {
    return balanceAfter.sub(balanceBefore);
  }
}
