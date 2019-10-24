import {BuidlerNetworkConfig} from '@nomiclabs/buidler/types';
import defaultAccounts from './config/defaultAccounts';

const defaultBuidlerOptions = {
  accounts: defaultAccounts.map((account) => ({
    balance: account.balance,
    privateKey: account.secretKey
  })),
  blockGasLimit: 8000000000000,
  hardfork: 'istanbul',
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
  chainId: 17
  };

export const createBuidlerProvider = (buidlerOptionsOrPathToConfig: string | BuidlerNetworkConfig = {}) => {
  const {createProvider} = require('@nomiclabs/buidler/internal/core/providers/construction');
  const {EthersProviderWrapper} = require('@nomiclabs/buidler-ethers/dist/ethers-provider-wrapper');

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
