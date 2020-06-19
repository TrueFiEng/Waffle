import {toBeProperAddress} from './matchers/toBeProperAddress';
import {toBeProperPrivateKey} from './matchers/toBeProperPrivateKey';
import {toBeProperHex} from './matchers/toBeProperHex';
import {bigNumberMatchers} from './matchers/bigNumber';
import {toChangeBalance} from './matchers/toChangeBalance';
import {toChangeBalances} from './matchers/toChangeBalances';
import {toBeReverted} from './matchers/toBeReverted';

export const waffleJest = {
  toBeProperAddress,
  toBeProperPrivateKey,
  toBeProperHex,
  ...bigNumberMatchers,
  toChangeBalance,
  toChangeBalances,
  toBeReverted
};
