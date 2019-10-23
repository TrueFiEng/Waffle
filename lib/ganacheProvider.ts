import Ganache, {GanacheOpts} from 'ganache-core';
import {providers} from 'ethers';
import defaultAccounts from './config/defaultAccounts';

const defaultGanacheOptions = {accounts: defaultAccounts};

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
