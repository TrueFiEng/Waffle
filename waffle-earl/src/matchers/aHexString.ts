import {Matcher} from 'earljs/internals';

export class HexStringMatcher extends Matcher {
  constructor(private length?: number) {
    super();
  }

  check(value: unknown) {
    if (typeof value !== 'string') {
      return false;
    }

    const regexp = this.length !== undefined
      ? new RegExp(`^0x[0-9-a-fA-F]{${this.length}}$`)
      : /^0x[0-9-a-fA-F]*$/;

    return regexp.test(value);
  }

  toString() {
    return this.length !== undefined ? `HexString(${this.length})` : 'HexString';
  }

  static make(length?: number): string {
    return new HexStringMatcher(length) as any;
  }
}
