import {expect} from 'earljs';

describe('toBeAnAddress', () => {
  const passingCases = [
    '0xbc58D03d0C6dE0900C17cddc828A6Cf48dFCEbDC',
    '0xA5526749D68d9e1844a14CE65B79b7501dCCb70d',
    '0x050F322B162E54288E30d389AB07B28Cd8fab457'
  ];
  for (const value of passingCases) {
    it(`expect("${value}").toBeAnAddress()`, () => {
      expect(value).toBeAnAddress();
    });

    it(`expect("${value.toLowerCase()}").toBeAnAddress()`, () => {
      expect(value.toLowerCase()).toBeAnAddress();
    });

    it(`expect("${value.toUpperCase()}").not.toBeAnAddress()`, () => {
      expect(value.toUpperCase()).not.toBeAnAddress();
    });
  }

  const failingCases = [
    '0x050F322B162E54288E30d389AB07B28Cd8fAb457',
    '0x050F322B162E54288E30d389AB07B28Cd8fab45',
    '050F322B162E54288E30d389AB07B28Cd8fab457',
    'foo'
  ];
  for (const value of failingCases) {
    it(`expect("${value}").not.toBeAnAddress()`, () => {
      expect(value).not.toBeAnAddress();
    });
  }

  describe('error messages', () => {
    it('is not an ethereum address', () => {
      expect(() => expect('foo').toBeAnAddress()).toThrow(
        'String "foo" is not an ethereum address!'
      );
    });

    it('is an ethereum address', () => {
      expect(() =>
        expect('0xbc58D03d0C6dE0900C17cddc828A6Cf48dFCEbDC').not.toBeAnAddress()
      ).toThrow(
        'String "0xbc58D03d0C6dE0900C17cddc828A6Cf48dFCEbDC" is an ethereum address!'
      );
    });
  });
});
