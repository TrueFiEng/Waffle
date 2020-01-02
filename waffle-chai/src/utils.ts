import {Wallet, utils} from 'ethers';

export async function getBalanceChange(transactionCallback: () => any, wallet: Wallet) {
  const balanceBefore = await wallet.getBalance();
  await transactionCallback();
  const balanceAfter = await wallet.getBalance();
  return balanceAfter.sub(balanceBefore);
}

export async function getBalanceChanges(transactionCallback: () => any, wallets: Wallet[]) {
  const balancesBefore = await Promise.all(wallets.map((wallet) => wallet.getBalance()));
  await transactionCallback();
  const balancesAfter = await Promise.all(wallets.map((wallet) => wallet.getBalance()));
  return balancesAfter.map((balance, ind) => balance.sub(balancesBefore[ind]));
}

export const overwriteBigNumberFunction = (
  functionName: string,
  readableName: string,
  _super: (...args: any[]) => any,
  chaiUtils: {flag: (...args: any[]) => any}
) => function (this: any, ...args: any[]) {
  const [actual] = args;
  const expected = chaiUtils.flag(this, 'object');
  if (utils.BigNumber.isBigNumber(expected)) {
    this.assert((expected as any)[functionName](actual),
      `Expected "${expected}" to be ${readableName} ${actual}`,
      `Expected "${expected}" NOT to be ${readableName} ${actual}`,
      expected,
      actual);
  } else if (utils.BigNumber.isBigNumber(actual)) {
    this.assert((actual as any)[functionName](expected),
      `Expected "${expected}" to be ${readableName} ${actual}`,
      `Expected "${expected}" NOT to be ${readableName} ${actual}`,
      expected,
      actual);
  } else {
    _super.apply(this, args);
  }
};
