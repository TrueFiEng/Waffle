import Ganache, { GanacheOpts } from 'ganache-core';
import {ContractFactory, providers, Contract, Wallet} from 'ethers';
import matchers from './matchers/matchers';
import defaultAccounts from './config/defaultAccounts';
import defaultDeployOptions from './config/defaultDeployOptions';
import {linkSolidity4, linkSolidity5, LinkableContract} from './link';
import './matchers/matchertypes';

const defaultGanacheOptions = {accounts: defaultAccounts};

export function createMockProvider(ganacheOptions: GanacheOpts = {}) {
  const options = {...defaultGanacheOptions, ...ganacheOptions };
  return new providers.Web3Provider(Ganache.provider(options));
}

export function getWallets(provider: providers.Provider) {
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
  const factory = new ContractFactory(
    contractJSON.abi,
    contractJSON.evm.bytecode,
    wallet
  );
  const contract = await factory.deploy(...args, {
    ...defaultDeployOptions,
    ...overrideOptions
  });
  await contract.deployed();
  return contract;
}

export const link = (contract: LinkableContract, libraryName: string, libraryAddress: string) => {
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
interface Snapshot<T> {
  fixture: Fixture<T>;
  data: T;
  id: number;
}

export function createFixtureLoader(provider = createMockProvider(), wallets?: Wallet[]) {
  const snapshots: Snapshot<any>[] = [];

  return async function load<T>(fixture: Fixture<T>): Promise<T> {
    const matchingSnapshot = snapshots.find((snapshot) => snapshot.fixture === fixture);
    if (matchingSnapshot) {
      await provider.send('evm_revert', [matchingSnapshot.id]);
      await provider.send('evm_snapshot', []);
      return matchingSnapshot.data;
    }
    const data = await fixture(provider, wallets || getWallets(provider));
    const id = await provider.send('evm_snapshot', []);
    snapshots.push({fixture, data, id});
    return data;
  };
}

export const loadFixture = createFixtureLoader();
