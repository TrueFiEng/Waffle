import fs from 'fs';
import Ganache from 'ganache-core';
import Compiler from './compiler';
import ethers, {providers} from 'ethers';
import matchers from './matchers';
import defaultAccounts from './config/defaultAccounts';
import defaultDeployOptions from './config/defaultDeployOptions';

const defaultGanacheOptions = {accounts: defaultAccounts};

export function createMockProvider(ganacheOptions = {}) {
  const options = {...defaultGanacheOptions, ganacheOptions};
  return new providers.Web3Provider(Ganache.provider(options));
}

export async function getWallets(provider) {
  return defaultAccounts.map((account) => new ethers.Wallet(account.secretKey, provider));
}

export async function deployContract(wallet, contractJSON, args = [], overrideOptions = {}) {
  const {provider} = wallet;
  const bytecode = `0x${contractJSON.bytecode}`;
  const abi = contractJSON.interface;
  const deployTransaction = {
    ...defaultDeployOptions,
    ...overrideOptions,
    ...ethers.Contract.getDeployTransaction(bytecode, abi, ...args)
  };
  const tx = await wallet.sendTransaction(deployTransaction);
  const receipt = await provider.getTransactionReceipt(tx.hash);
  return new ethers.Contract(receipt.contractAddress, abi, wallet);
}

export async function compile(configPath) {
  try {
    let config = {};
    if (configPath) {
      const contents = fs.readFileSync(configPath);
      config = JSON.parse(contents);
    }
    const compiler = new Compiler(config);
    await compiler.compile();
  } catch (err) {
    console.error(err);
  }
}

export const contractWithWallet = (contract, wallet) =>
  new ethers.Contract(contract.address, contract.interface.abi, wallet);

export {defaultAccounts};

export const solidity = matchers;
