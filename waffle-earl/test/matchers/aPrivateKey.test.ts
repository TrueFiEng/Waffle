import {expect} from 'earljs';

describe('aPrivateKey', () => {
  const passingCases = [
    '0x319a66d5912bd7b08efb26c2ea2f0b68d521653e3a49db9864d683997be9ed4d',
    '0xdb646a766da01153ec791413a7288394736b21cb5645606639bbc7e8b3cc5c5b'
  ];
  for (const value of passingCases) {
    it(`expect("${value}").toEqual(expect.aPrivateKey())`, () => {
      expect(value).toEqual(expect.aPrivateKey());
    });
  }

  const failingCases = [
    '0x319a66d5912bd7b08efb26c2ea2f0b68d521653e3a49db9864d683997be9ed4',
    '319a66d5912bd7b08efb26c2ea2f0b68d521653e3a49db9864d683997be9ed4d',
    'foo'
  ];
  for (const value of failingCases) {
    it(`expect("${value}").not.toEqual(expect.aPrivateKey())`, () => {
      expect(value).not.toEqual(expect.aPrivateKey());
    });
  }
});
