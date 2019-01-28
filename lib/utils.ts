import fs from 'fs';
import { Wallet } from 'ethers';

export const readFileContent = (path: string): string =>
  fs.readFileSync(path).toString();

export const isPositiveIntegerString = (value: unknown) =>
  typeof value === 'string' && /^\d+$/.test(value);

export const eventParseResultToArray = (eventResult: object) =>
  Object.keys(eventResult)
    .filter(isPositiveIntegerString)
    .map((key) => (eventResult as any)[key]);

export const isWarningMessage = (error: any) =>
  error.severity === 'warning';

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

export const isFile = (filePath: string) =>
  fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();

export const flattenObjectArray = (array: object[]) =>
  array.reduce((accum, object) => Object.assign(accum, object), {});

export const last = <T>(array: T[]): T =>
  array[array.length - 1];

export const deepCopy = (obj: any) =>
  JSON.parse(JSON.stringify(obj));
