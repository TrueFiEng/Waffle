import {HexStringMatcher} from './matchers/aHexString';
import {AddressMatcher} from './matchers/anAddress';
import {PrivateKeyMatcher} from './matchers/aPrivateKey';
import {toBeAHexString} from './validators/toBeAHexString';
import {toBeAnAddress} from './validators/toBeAnAddress';
import {toBeAPrivateKey} from './validators/toBeAPrivateKey';
import {toEmit} from './validators/toEmit';

export const plugin = {
  validators: {
    toBeAHexString,
    toBeAnAddress,
    toBeAPrivateKey,
    toEmit
  },
  matchers: {
    aHexString: HexStringMatcher.make,
    anAddress: AddressMatcher.make,
    aPrivateKey: PrivateKeyMatcher.make
  },
  smartEqRules: []
};
