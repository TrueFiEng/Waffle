import Ganache from 'ganache-core';
import Compiler from './compiler';
import ethers, {providers, utils} from 'ethers';
import matchers from './matchers';
import defaultAccounts from './config/defaultAccounts';
import defaultDeployOptions from './config/defaultDeployOptions';
import MockENS from '../build/MockENS';
import MockENSProxy from './MockENSProxy';

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

export async function compile() {
  const compiler = new Compiler();
  await compiler.compile();
}

export const contractWithWallet = (contract, wallet) =>
  new ethers.Contract(contract.address, contract.interface.abi, wallet);

export const withMockENS = async (provider) => {
  const [wallet] = await getWallets(provider);
  const ens = await deployContract(wallet, MockENS, []);
  const chainSpec = {
    chainId: 0,
    ensAddress: ens.address
  };
  // eslint-disable-next-line no-underscore-dangle
  const providerWithMockENS = new providers.Web3Provider(provider._web3Provider, chainSpec);
  const mockENS = new MockENSProxy(providerWithMockENS, wallet);
  utils.defineProperty(providerWithMockENS, 'ens', mockENS);
  return providerWithMockENS;
};

export {defaultAccounts, MockENS};

export const solidity = matchers;
