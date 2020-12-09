import {HexStringMatcher} from './matchers/aHexString';
import {AddressMatcher} from './matchers/anAddress';
import {toBeAHexString} from './validators/toBeAHexString';
import {toBeAnAddress} from './validators/toBeAnAddress';

export const plugin = {
  validators: {
    toBeAHexString,
    toBeAnAddress
  },
  matchers: {
    aHexString: HexStringMatcher.make,
    anAddress: AddressMatcher.make
  },
  smartEqRules: []
};
