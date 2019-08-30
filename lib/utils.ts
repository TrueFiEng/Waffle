import fs from 'fs';
import path from 'path';
import {Wallet, Contract, ContractFactory} from 'ethers';
import {TransactionResponse} from 'ethers/providers';

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

export const isDirectory = (directoryPath: string) =>
  fs.existsSync(relativePathToWorkingDir(directoryPath)) &&
  fs.statSync(relativePathToWorkingDir(directoryPath)).isDirectory();

export const relativePathToWorkingDir = (pathName: string) => path.resolve(pathName);

const defaultDeployOptions = {
  gasLimit: 4000000,
  gasPrice: 9000000000
};

export const deployContract =
  async (wallet: Wallet, contractJSON: any, args: any[] = [], overrideOptions: any = {}): Promise<Contract> => {
    const {provider} = wallet;
    const bytecode = `0x${contractJSON.bytecode}`;
    const abi = contractJSON.interface;
    const deployTransaction = {
      ...defaultDeployOptions,
      ...overrideOptions,
      ...new ContractFactory(abi, bytecode).getDeployTransaction(...args)
    };
    const tx = await wallet.sendTransaction(deployTransaction);
    const receipt = await provider.waitForTransaction(tx.hash);
    return new Contract(receipt.contractAddress, abi, wallet);
};

export const waitToBeMined = async (receipt: TransactionResponse) => {
  const {wait} = receipt;
  await wait();
};
