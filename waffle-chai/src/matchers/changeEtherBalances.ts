import {BigNumber, BigNumberish, providers} from 'ethers';
import {ensure} from './calledOnContract/utils';
import {getAddressOf, Account} from './misc/account';

export function supportChangeEtherBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeEtherBalances', function (
    this: any,
    signers: Account[],
    balanceChanges: BigNumberish[],
    options: any
  ) {
    const subject = this._obj;

    const derivedPromise = Promise.all([
      getBalanceChanges(subject, signers, options),
      getAddresses(signers)
    ]).then(
      ([actualChanges, signerAddresses]) => {
        this.assert(
          actualChanges.every((change, ind) =>
            change.eq(BigNumber.from(balanceChanges[ind]))
          ),
          `Expected ${signerAddresses} to change balance by ${balanceChanges} wei, ` +
            `but it has changed by ${actualChanges} wei`,
          `Expected ${signerAddresses} to not change balance by ${balanceChanges} wei,`,
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

async function getBalanceChanges(
  transaction: providers.TransactionResponse | (() => Promise<providers.TransactionResponse> | providers.TransactionResponse),
  accounts: Account[],
  options: any
) {
  if (typeof transaction === 'function') {
    return getBalancesChangeForTransactionCall(transaction, accounts, options);
  } else {
    return getBalancesChangeForTransactionResponse(transaction, accounts, options);
  }
}

function getAddresses(accounts: Account[]) {
  return Promise.all(accounts.map((account) => getAddressOf(account)));
}

async function getBalances(accounts: Account[], blockNumber?: number) {
  return Promise.all(
    accounts.map((account) => {
      ensure(account.provider !== undefined, TypeError, 'Provider not found');
      if (blockNumber) {
        return account.provider.getBalance(getAddressOf(account), blockNumber);
      } else {
        return account.provider.getBalance(getAddressOf(account));
      }
    })
  );
}

async function getTxFees(accounts: Account[], txResponse: providers.TransactionResponse, options: any) {
  return Promise.all(
    accounts.map(async (account) => {
      if (options?.includeFee === true && await getAddressOf(account) == txResponse.from) {
        const txReceipt = await txResponse.wait();
        const gasPrice = txResponse.gasPrice;
        const gasUsed = txReceipt.gasUsed;
        const txFee = gasPrice.mul(gasUsed);

        return txFee;
      }

      return 0;
    })
  );
}

async function getBalancesChangeForTransactionCall(transactionCall: (() => Promise<providers.TransactionResponse> | providers.TransactionResponse), accounts: Account[], options: any) {
  const balancesBefore = await getBalances(accounts);
  const txResponse = await transactionCall();
  const balancesAfter = await getBalances(accounts);

  const txFees = await getTxFees(accounts, txResponse, options);

  return balancesAfter.map((balance, ind) => balance.add(txFees[ind]).sub(balancesBefore[ind]));
}

async function getBalancesChangeForTransactionResponse(
  txResponse: providers.TransactionResponse,
  accounts: Account[],
  options: any
) {
  const txBlockNumber = (await txResponse.wait()).blockNumber;

  const balancesAfter = await getBalances(accounts, txBlockNumber);
  const balancesBefore = await getBalances(accounts, txBlockNumber - 1);

  const txFees = await getTxFees(accounts, txResponse, options);

  return balancesAfter.map((balance, ind) => balance.add(txFees[ind]).sub(balancesBefore[ind]));
}
