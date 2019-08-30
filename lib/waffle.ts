import Ganache, { GanacheOpts } from 'ganache-core';
import {ContractFactory, providers, Wallet} from 'ethers';
import matchers from './matchers/matchers';
import defaultAccounts from './config/defaultAccounts';
import defaultDeployOptions from './config/defaultDeployOptions';
import {linkSolidity4, linkSolidity5, LinkableContract} from './link';
import './matchers/matchertypes';
import ENSBuilder from './ENSBuilder/ENSBuilder';

const defaultGanacheOptions = {accounts: defaultAccounts};

export const createMockProvider = (ganacheOptionsOrPathToConfig: string | GanacheOpts = {}) => {
  const ganacheOptions = getGanacheOptions(ganacheOptionsOrPathToConfig);
  const options = {...defaultGanacheOptions, ...ganacheOptions };
  return new providers.Web3Provider(Ganache.provider(options));
};

export const getGanacheOptions = (ganacheOptionsOrPathToConfig: string | GanacheOpts) => {
  if (typeof ganacheOptionsOrPathToConfig === 'object') {
    return ganacheOptionsOrPathToConfig;
  }
  const {ganacheOptions} = require(ganacheOptionsOrPathToConfig);
  return ganacheOptions;
};

export function getWallets(provider: providers.Provider) {
  return defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
}

interface StandardContractJSON {
  abi: any;
  evm: {bytecode: {object: any}};
}

interface SimpleContractJSON {
  abi: any[];
  bytecode: string;
}

type ContractJSON = StandardContractJSON | SimpleContractJSON;

const isStandard = (data: ContractJSON): data is StandardContractJSON =>
  typeof (data as any).evm === 'object' &&
  (data as any).evm !== null &&
  typeof (data as any).evm.bytecode === 'object' &&
  (data as any).evm.bytecode !== null;

const hasByteCode = (bytecode: {object: any} | string) => {
  if (typeof bytecode === 'object') {
    return Object.entries(bytecode.object).length !== 0;
  }
  return Object.entries(bytecode).length !== 0;
};

export async function deployContract(
  wallet: Wallet,
  contractJSON: ContractJSON,
  args: any[] = [],
  overrideOptions: providers.TransactionRequest = {}
) {
  const bytecode = isStandard(contractJSON) ? contractJSON.evm.bytecode : contractJSON.bytecode;
  if (!hasByteCode(bytecode)) {
    throw new Error('Cannot deploy contract with empty bytecode');
  }
  const factory = new ContractFactory(
    contractJSON.abi,
    bytecode,
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
  id: string;
  provider: providers.Web3Provider;
  wallets: Wallet[];
}

export function createFixtureLoader(overrideProvider?: providers.Web3Provider, overrideWallets?: Wallet[]) {
  const snapshots: Snapshot<any>[] = [];

  return async function load<T>(fixture: Fixture<T>): Promise<T> {
    const snapshot = snapshots.find((snapshot) => snapshot.fixture === fixture);
    if (snapshot) {
      await snapshot.provider.send('evm_revert', [snapshot.id]);
      snapshot.id = await snapshot.provider.send('evm_snapshot', []);
      return snapshot.data;
    } else {
      const provider = overrideProvider || createMockProvider();
      const wallets = overrideWallets || getWallets(provider);

      const data = await fixture(provider, wallets);
      const id = await provider.send('evm_snapshot', []);

      snapshots.push({fixture, data, id, provider, wallets});
      return data;
    }
  };
}
export const loadFixture = createFixtureLoader();

export {ENSBuilder};
