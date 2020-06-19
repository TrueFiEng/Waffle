import {toBeProperAddress} from './matchers/toBeProperAddress';
import {toBeProperPrivateKey} from './matchers/toBeProperPrivateKey';
import {toBeProperHex} from './matchers/toBeProperHex';
import {bigNumberMatchers} from './matchers/bigNumber';

export const waffleJest = {
  toBeProperAddress,
  toBeProperPrivateKey,
  toBeProperHex,
  ...bigNumberMatchers
};
