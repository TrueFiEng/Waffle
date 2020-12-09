import {expect} from 'earljs';

describe('toBeAHexString', () => {
  const passingCases = [
    '0x',
    '0x70',
    '0x03c909455d',
    '0xAaBb1234'
  ];
  for (const value of passingCases) {
    const length = value.length - 2;

    it(`expect("${value}").toBeAHexString()`, () => {
      expect(value).toBeAHexString();
    });

    it(`expect("${value}").toBeAHexString(${length})`, () => {
      expect(value).toBeAHexString(length);
    });

    it(`expect("${value}").not.toBeAHexString(${length + 1})`, () => {
      expect(value).not.toBeAHexString(length + 1);
    });
  }

  const failingCases = [
    'foo',
    '0x1g',
    '1a2b3c'
  ];
  for (const value of failingCases) {
    it(`expect("${value}").not.toBeAHexString()`, () => {
      expect(value).not.toBeAHexString();
    });

    it(`expect("${value}").not.toBeAHexString(1)`, () => {
      expect(value).not.toBeAHexString(1);
    });
  }

  describe('error messages', () => {
    it('is not a hex string', () => {
      expect(() => expect('foo').toBeAHexString()).toThrow('String "foo" is not a hex string!');
    });

    it('is a hex string', () => {
      expect(() => expect('0x123').not.toBeAHexString()).toThrow('String "0x123" is a hex string!');
    });

    it('is not a hex string of length', () => {
      expect(() => expect('0x123').toBeAHexString(4)).toThrow('String "0x123" is not a hex string of length 4!');
    });

    it('is a hex string of length', () => {
      expect(() => expect('0x1234').not.toBeAHexString(4)).toThrow('String "0x1234" is a hex string of length 4!');
    });
  });
});
