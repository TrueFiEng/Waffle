import {Matcher} from 'earljs/internals';
import {isPrivateKey} from '../utils';

export class PrivateKeyMatcher extends Matcher {
  check(value: unknown) {
    if (typeof value !== 'string') {
      return false;
    }
    return isPrivateKey(value);
  }

  toString() {
    return 'PrivateKey';
  }

  static make(): string {
    return new PrivateKeyMatcher() as any;
  }
}
