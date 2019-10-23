import Ganache, {GanacheOpts} from 'ganache-core';
import {createProvider} from '@nomiclabs/buidler/internal/core/providers/construction';
import {EthersProviderWrapper} from '@nomiclabs/buidler-ethers/dist/ethers-provider-wrapper';
import {BuidlerNetworkConfig} from '@nomiclabs/buidler/types';
import {providers, Wallet} from 'ethers';
import defaultAccounts from './config/defaultAccounts';

const defaultGanacheOptions = {accounts: defaultAccounts};
const defaultBuidlerOptions = {
  accounts: defaultAccounts.map((account) => ({
    balance: account.balance,
    privateKey: account.secretKey
  })),
  blockGasLimit: 8000000000000,
  hardfork: 'petersburg',
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
  chainId: 17
  };

export const createMockProvider = (providerOptionsOrPathToConfig: string | GanacheOpts = {}) => {
  return createGanacheProvider(providerOptionsOrPathToConfig);
};

export const createGanacheProvider = (ganacheOptionsOrPathToConfig: string | GanacheOpts = {}) => {
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

export const createBuidlerProvider = (buidlerOptionsOrPathToConfig: string | BuidlerNetworkConfig = {}) => {
  const buidlerOptions = getBuidlerOptions(buidlerOptionsOrPathToConfig);
  const options = {...defaultBuidlerOptions, ...buidlerOptions };
  return  new EthersProviderWrapper(createProvider('buidlerevm', options));
};

export const getBuidlerOptions = (buidlerOptionsOrPathToConfig: string | BuidlerNetworkConfig) => {
  if (typeof buidlerOptionsOrPathToConfig === 'object') {
    return buidlerOptionsOrPathToConfig;
  }
  const {buidlerOptions} = require(buidlerOptionsOrPathToConfig);
  return buidlerOptions;
};

export function getWallets(provider: providers.Provider) {
  return defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
}
