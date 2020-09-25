import {BigNumber, BigNumberish, Contract} from 'ethers';
import {Account, getAddressOf} from './misc/account';

export function supportChangeTokenBalances(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('changeTokenBalances', function (
    this: any,
    token: Contract,
    signers: Account[],
    balanceChanges: BigNumberish[]
  ) {
    const subject = this._obj;
    const derivedPromise = Promise.all([
      getBalanceChangeForTransactionCall(subject, token, signers),
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

function getAddresses(accounts: Account[]) {
  return Promise.all(accounts.map((account) => getAddressOf(account)));
}

async function getBalances(token: Contract, accounts: Account[]) {
  return Promise.all(
    accounts.map(async (account) => {
      return token.balanceOf(getAddressOf(account));
    })
  );
}

async function getBalanceChangeForTransactionCall(
  transactionCall: (() => Promise<void> | void),
  token: Contract,
  accounts: Account[]
) {
  const balancesBefore = await getBalances(token, accounts);
  await transactionCall();
  const balancesAfter = await getBalances(token, accounts);

  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}
