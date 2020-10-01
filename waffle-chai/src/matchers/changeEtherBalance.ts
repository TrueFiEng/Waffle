import {BigNumber, BigNumberish, providers} from 'ethers';
import {ensure} from './calledOnContract/utils';
import {Account, getAddressOf} from './misc/account';

export function supportChangeEtherBalance(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeEtherBalance', function (
    this: any,
    signer: Account,
    balanceChange: BigNumberish,
    options: any
  ) {
    const subject = this._obj;
    const derivedPromise = Promise.all([
      getBalanceChange(subject, signer, options),
      getAddressOf(signer)
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
  transaction:
  | providers.TransactionResponse
  | (() => Promise<providers.TransactionResponse>
  | providers.TransactionResponse),
  account: Account,
  options: any
) {
  if (typeof transaction === 'function') {
    return getBalanceChangeForTransactionCall(transaction, account, options);
  } else {
    return getBalanceChangeForTransactionResponse(transaction, account, options);
  }
}

async function getBalanceChangeForTransactionCall(
  transactionCall: (() => Promise<providers.TransactionResponse> | providers.TransactionResponse),
  account: Account,
  options: any
) {
  ensure(account.provider !== undefined, TypeError, 'Provider not found');

  const balanceBefore = await account.provider.getBalance(getAddressOf(account));

  const txResponse = await transactionCall();
  const txReceipt = await txResponse.wait();

  const balanceAfter = await account.provider.getBalance(getAddressOf(account));

  if (options?.includeFee !== true && await getAddressOf(account) === txResponse.from) {
    const gasPrice = txResponse.gasPrice;
    const gasUsed = txReceipt.gasUsed;
    const txFee = gasPrice.mul(gasUsed);

    return balanceAfter.add(txFee).sub(balanceBefore);
  } else {
    return balanceAfter.sub(balanceBefore);
  }
}

async function getBalanceChangeForTransactionResponse(
  txResponse: providers.TransactionResponse,
  account: Account,
  options: any
) {
  ensure(account.provider !== undefined, TypeError, 'Provider not found');

  const txReceipt = await txResponse.wait();
  const txBlockNumber = txReceipt.blockNumber;

  const balanceAfter = await account.provider.getBalance(getAddressOf(account), txBlockNumber);
  const balanceBefore = await account.provider.getBalance(getAddressOf(account), txBlockNumber - 1);

  if (options?.includeFee !== true && await getAddressOf(account) === txResponse.from) {
    const gasPrice = txResponse.gasPrice;
    const gasUsed = txReceipt.gasUsed;
    const txFee = gasPrice.mul(gasUsed);

    return balanceAfter.add(txFee).sub(balanceBefore);
  } else {
    return balanceAfter.sub(balanceBefore);
  }
}
