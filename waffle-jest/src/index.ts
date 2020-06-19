import {toBeProperAddress} from './matchers/toBeProperAddress';
import {toBeProperPrivateKey} from './matchers/toBeProperPrivateKey';
import {toBeProperHex} from './matchers/toBeProperHex';
import {bigNumberMatchers} from './matchers/bigNumber';
import {toChangeBalance} from './matchers/toChangeBalance';

export const waffleJest = {
  toBeProperAddress,
  toBeProperPrivateKey,
  toBeProperHex,
  ...bigNumberMatchers,
  toChangeBalance
};
