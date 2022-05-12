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
    const isNegated = this.__flags.negate === true;
    const derivedPromise = this.txPromise.then(() => {
      return Promise.all([
        getBalanceChange(this.txResponse, account, options),
        getAddressOf(account)
      ]);
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
    }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.txPromise = derivedPromise;
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
    const provider = account.provider as any;
    if(typeof provider.getL1Fee === 'function') {
      const l1Fee = await provider.getL1Fee(txReceipt.transactionHash);
      return balanceAfter.add(txFee).add(l1Fee).sub(balanceBefore)
    }

    return balanceAfter.add(txFee).sub(balanceBefore);
  } else {
    return balanceAfter.sub(balanceBefore);
  }
}
