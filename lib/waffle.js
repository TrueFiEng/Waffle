import Ganache from 'ganache-core';
import Compiler from './compiler';
import ethers, {providers} from 'ethers';
import matchers from './matchers';
import defaultAccounts from './config/defaultAccounts';

const defaultGanacheOptions = {accounts: defaultAccounts};

export function createMockProvider(ganacheOptions = {}) {
  const options = {...defaultGanacheOptions, ganacheOptions};
  return new providers.Web3Provider(Ganache.provider(options));
}

export async function getWallets(provider) {
  return defaultAccounts.map((account) => new ethers.Wallet(account.secretKey, provider));
}

export async function deployContract(wallet, contractJSON, args = []) {
  const {provider} = wallet;
  const bytecode = `0x${contractJSON.bytecode}`;
  const abi = contractJSON.interface;
  const deployTransaction = ethers.Contract.getDeployTransaction(bytecode, abi, ...args);
  const tx = await wallet.sendTransaction(deployTransaction);
  const receipt = await provider.getTransactionReceipt(tx.hash);
  return new ethers.Contract(receipt.contractAddress, abi, wallet);
}

export async function compile() {
  const compiler = new Compiler();
  await compiler.compile();
}

export const solidity = matchers;
