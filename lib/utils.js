import fs from 'fs';

export const readFileContent = (path) =>
  fs.readFileSync(path).toString();

export const isPositiveIntegerString = (string) =>
  /^\d+$/.test(string);

export const eventParseResultToArray = (eventResult) =>
  Object.keys(eventResult)
    .filter(isPositiveIntegerString)
    .map((key) => eventResult[key]);

export const isWarningMessage = (error) =>
  error.severity === 'warning';

export const getBalanceChange = async (transactionCallback, wallet) => {
  const balanceBefore = await wallet.getBalance();
  await transactionCallback();
  const balanceAfter = await wallet.getBalance();
  return balanceAfter.sub(balanceBefore);
};

export const getBalanceChanges = async (transactionCallback, wallets) => {
  const balancesBefore = await Promise.all(wallets.map((wallet) => wallet.getBalance()));
  await transactionCallback();
  const balancesAfter = await Promise.all(wallets.map((wallet) => wallet.getBalance()));
  return balancesAfter.map((balancesAfter, ind) => balancesAfter.sub(balancesBefore[ind]));
};
export const isDirectory = (filePath) =>
  fs.existsSync(filePath) && fs.statSync(filePath).isDirectory(filePath);

export const isFile = (filePath) =>
  fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();

export const falttenObjectArray = (array) =>
  array.reduce((accum, object) => Object.assign(accum, object), {});

export const last = (array) =>
  array[array.length - 1];
