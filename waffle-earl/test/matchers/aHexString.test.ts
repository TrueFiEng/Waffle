import {expect} from 'earljs';

describe('aHexString', () => {
  const passingCases = [
    '0x',
    '0x70',
    '0x03c909455d',
    '0xAaBb1234'
  ];
  for (const value of passingCases) {
    const length = value.length - 2;

    it(`expect("${value}").toEqual(expect.aHexString())`, () => {
      expect(value).toEqual(expect.aHexString());
    });

    it(`expect("${value}").toEqual(expect.aHexString(${length}))`, () => {
      expect(value).toEqual(expect.aHexString(length));
    });

    it(`expect("${value}").not.toEqual(expect.aHexString(${length + 1}))`, () => {
      expect(value).not.toEqual(expect.aHexString(length + 1));
    });
  }

  const failingCases = [
    'foo',
    '0x1g',
    '1a2b3c'
  ];
  for (const value of failingCases) {
    it(`expect("${value}").not.toEqual(expect.aHexString())`, () => {
      expect(value).not.toBeAHexString();
    });

    it(`expect("${value}").not.toEqual(expect.aHexString(1))`, () => {
      expect(value).not.toEqual(expect.aHexString(1));
    });
  }
});
