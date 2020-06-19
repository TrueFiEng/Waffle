import {toBeProperAddress} from './matchers/toBeProperAddress';
import {toBeProperPrivateKey} from './matchers/toBeProperPrivateKey';
import {toBeProperHex} from './matchers/toBeProperHex';
import {bigNumberMatchers} from './matchers/bigNumber';
import {toChangeBalance} from './matchers/toChangeBalance';
import {toChangeBalances} from './matchers/toChangeBalances';
import {toBeReverted} from './matchers/toBeReverted';
import {toBeRevertedWith} from './matchers/toBeRevertedWith';

export const waffleJest = {
  // misc matchers
  toBeProperAddress,
  toBeProperPrivateKey,
  toBeProperHex,

  // BigNumber matchers
  ...bigNumberMatchers,

  // balance matchers
  toChangeBalance,
  toChangeBalances,

  // revert matchers
  toBeReverted,
  toBeRevertedWith
};
