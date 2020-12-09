import {expect} from 'earljs';

describe('toBeAPrivateKey', () => {
  const passingCases = [
    '0x319a66d5912bd7b08efb26c2ea2f0b68d521653e3a49db9864d683997be9ed4d',
    '0xdb646a766da01153ec791413a7288394736b21cb5645606639bbc7e8b3cc5c5b'
  ];
  for (const value of passingCases) {
    it(`expect("${value}").toBeAPrivateKey()`, () => {
      expect(value).toBeAPrivateKey();
    });
  }

  const failingCases = [
    '0x319a66d5912bd7b08efb26c2ea2f0b68d521653e3a49db9864d683997be9ed4',
    '319a66d5912bd7b08efb26c2ea2f0b68d521653e3a49db9864d683997be9ed4d',
    'foo'
  ];
  for (const value of failingCases) {
    it(`expect("${value}").not.toBeAPrivateKey()`, () => {
      expect(value).not.toBeAPrivateKey();
    });
  }

  describe('error messages', () => {
    it('is not a private key', () => {
      expect(() => expect('foo').toBeAPrivateKey()).toThrow(
        'String "foo" is not a private key!'
      );
    });

    it('is a private key', () => {
      expect(() =>
        expect(
          '0x319a66d5912bd7b08efb26c2ea2f0b68d521653e3a49db9864d683997be9ed4d'
        ).not.toBeAPrivateKey()
      ).toThrow(
        'String "0x319a66d5912bd7b08efb26c2ea2f0b68d521653e3a49db9864d683997be9ed4d" is a private key!'
      );
    });
  });
});
