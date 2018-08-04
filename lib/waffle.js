import Ganache from 'ganache-core';
import Compiler from './compiler';
import ethers, {providers} from 'ethers';

const defaultAccounts = [
  {
    balance: '10000000000000000000000000000000000',
    secretKey: '0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797'
  },
  {
    balance: '10000000000000000000000000000000000',
    secretKey: '0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74'
  }
];

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
