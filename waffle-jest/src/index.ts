import {toBeProperAddress} from './matchers/toBeProperAddress';
import {toBeProperPrivateKey} from './matchers/toBeProperPrivateKey';
import {toBeProperHex} from './matchers/toBeProperHex';

export const waffleJest = {
  toBeProperAddress,
  toBeProperPrivateKey,
  toBeProperHex
};
