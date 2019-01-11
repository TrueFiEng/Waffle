import Ganache, { GanacheOpts } from 'ganache-core';
import {ContractFactory, providers, Contract, Wallet} from 'ethers';
import matchers from './matchers';
import defaultAccounts from './config/defaultAccounts';
import defaultDeployOptions from './config/defaultDeployOptions';
import {linkSolidity4, linkSolidity5} from './link';

const defaultGanacheOptions = {accounts: defaultAccounts};

export function createMockProvider(ganacheOptions: GanacheOpts = {}) {
  const options = {...defaultGanacheOptions, ...ganacheOptions };
  return new providers.Web3Provider(Ganache.provider(options));
}

export async function getWallets(provider: providers.Provider) {
  return defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
}

interface ContractJSON {
  abi: any;
  evm: {bytecode: {object: any}};
}

export async function deployContract(
  wallet: Wallet,
  contractJSON: ContractJSON,
  args: any[] = [],
  overrideOptions: providers.TransactionRequest = {}
) {
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

export const contractWithWallet = (contract: Contract, wallet: Wallet) =>
  new Contract(contract.address, contract.interface.abi, wallet);

export const link = (contract: Contract, libraryName: string, libraryAddress: string) => {
  const {object} = contract.evm.bytecode;
  if (object.indexOf('$') >= 0) {
    linkSolidity5(contract, libraryName, libraryAddress);
  } else {
    linkSolidity4(contract, libraryName, libraryAddress);
  }
};

export {defaultAccounts};

export const solidity = matchers;

type Fixture<T> = (provider: providers.Provider, wallets: Wallet[]) => Promise<T>;

export function createFixtureLoader(provider = createMockProvider(), wallets?: Wallet[]) {
  const snapshots = [];

  return async function load<T>(fixture: Fixture<T>): Promise<T> {
    const matchingSnapshot = snapshots.find((snapshot) => snapshot.fixture === fixture);
    if (matchingSnapshot) {
      await provider.send('evm_revert', [matchingSnapshot.id]);
      await provider.send('evm_snapshot', []);
      return matchingSnapshot.data;
    }
    const data = await fixture(provider, wallets || await getWallets(provider));
    const id = await provider.send('evm_snapshot', []);
    snapshots.push({fixture, data, id});
    return data;
  };
}

export const loadFixture = createFixtureLoader();
