import Ganache from 'ganache-core';
import {ContractFactory, providers, Contract, Wallet} from 'ethers';
import matchers from './matchers';
import defaultAccounts from './config/defaultAccounts';
import defaultDeployOptions from './config/defaultDeployOptions';
import {linkSolidity4, linkSolidity5} from './link';

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
  const {object} = contract.evm.bytecode;
  if (object.indexOf('$') >= 0) {
    linkSolidity5(contract, libraryName, libraryAddress);
  } else {
    linkSolidity4(contract, libraryName, libraryAddress);
  }
};

export {defaultAccounts};

export const solidity = matchers;

export function createFixtureLoader(provider = createMockProvider(), wallets) {
  const snapshots = [];

  return async function loadFixture(fixture) {
    const snapshot = snapshots.find((snapshot) => snapshot.fixture === fixture);
    if (snapshot) {
      await provider.send('evm_revert', [snapshot.id]);
      await provider.send('evm_snapshot');
      return snapshot.data;
    }
    const data = await fixture(provider, wallets || await getWallets(provider));
    const id = await provider.send('evm_snapshot');
    snapshots.push({fixture, data, id});
    return data;
  };
}

export const loadFixture = createFixtureLoader();
