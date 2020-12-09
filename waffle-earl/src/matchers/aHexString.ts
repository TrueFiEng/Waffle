import {Matcher} from 'earljs/internals';
import {isHexString} from '../utils';

export class HexStringMatcher extends Matcher {
  constructor(private length?: number) {
    super();
  }

  check(value: unknown) {
    if (typeof value !== 'string') {
      return false;
    }
    return isHexString(value, this.length);
  }

  toString() {
    return this.length !== undefined
      ? `HexString(${this.length})`
      : 'HexString';
  }

  static make(length?: number): string {
    return new HexStringMatcher(length) as any;
  }
}
