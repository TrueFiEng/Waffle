import {HexStringMatcher} from './matchers/aHexString';
import {toBeAHexString} from './validators/toBeAHexString';

export const plugin = {
  validators: {toBeAHexString},
  matchers: {aHexString: HexStringMatcher.make},
  smartEqRules: []
};
