import Ganache from 'ganache-core';
import {ContractFactory, providers, Contract, Wallet, utils} from 'ethers';
import matchers from './matchers';
import defaultAccounts from './config/defaultAccounts';
import defaultDeployOptions from './config/defaultDeployOptions';

const defaultGanacheOptions = {accounts: defaultAccounts};

export function createMockProvider(ganacheOptions = {}) {
  const options = {...defaultGanacheOptions, ganacheOptions};
  return new providers.Web3Provider(Ganache.provider(options));
}

export async function getWallets(provider) {
  return defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
}

export async function deployContract(wallet, contractJSON, args = [], overrideOptions = {}) {
  const {abi} = contractJSON;
  const bytecode = `0x${contractJSON.evm.bytecode.object}`;
  const factory = new ContractFactory(abi, bytecode, wallet);
  const deployTransaction = {
    ...defaultDeployOptions,
    ...overrideOptions,
    ...factory.getDeployTransaction(...args)
  };
  const tx = await wallet.sendTransaction(deployTransaction);
  const receipt = await wallet.provider.getTransactionReceipt(tx.hash);
  return new Contract(receipt.contractAddress, abi, wallet);
}

export const contractWithWallet = (contract, wallet) =>
  new Contract(contract.address, contract.interface.abi, wallet);

export const link = (contract, libraryName, libraryAddress) => {
  const address = libraryAddress.replace('0x', '');
  const encodedLibraryName = utils
    .solidityKeccak256(['string'], [libraryName])
    .slice(2, 36);
  const pattern = new RegExp(`_+\\$${encodedLibraryName}\\$_+`, 'g');
  const bytecode = contract.evm.bytecode.object;
  if (!pattern.exec(bytecode)) {
    throw new Error(`Pattern not found for ${libraryName}`);
  }
  contract.evm.bytecode.object = bytecode.replace(pattern, address);
};

export {defaultAccounts};

export const solidity = matchers;
