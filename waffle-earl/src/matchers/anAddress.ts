import {Matcher} from 'earljs/internals';
import {isAddress} from '../utils';

export class AddressMatcher extends Matcher {
  check(value: unknown) {
    if (typeof value !== 'string') {
      return false;
    }
    return isAddress(value);
  }

  toString() {
    return 'Address';
  }

  static make(): string {
    return new AddressMatcher() as any;
  }
}
