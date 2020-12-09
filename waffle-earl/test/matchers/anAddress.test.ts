import {expect} from 'earljs';

describe('anAddress', () => {
  const passingCases = [
    '0xbc58D03d0C6dE0900C17cddc828A6Cf48dFCEbDC',
    '0xA5526749D68d9e1844a14CE65B79b7501dCCb70d',
    '0x050F322B162E54288E30d389AB07B28Cd8fab457'
  ];
  for (const value of passingCases) {
    it(`expect("${value}").toEqual(expect.anAddress())`, () => {
      expect(value).toEqual(expect.anAddress());
    });

    it(`expect("${value.toLowerCase()}").toEqual(expect.anAddress())`, () => {
      expect(value.toLowerCase()).toEqual(expect.anAddress());
    });
  }

  const failingCases = [
    '0x050F322B162E54288E30d389AB07B28Cd8fAb457',
    '0x050F322B162E54288E30d389AB07B28Cd8fab45',
    '050F322B162E54288E30d389AB07B28Cd8fab457',
    'foo'
  ];
  for (const value of failingCases) {
    it(`expect("${value}").not.toEqual(expect.anAddress())`, () => {
      expect(value).not.toEqual(expect.anAddress());
    });
  }
});
