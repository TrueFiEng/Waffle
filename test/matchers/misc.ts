import chai, {AssertionError} from 'chai';

const {expect} = chai;

describe('UNIT: Miscellaneous', () => {
  describe('Proper address', () => {
    it('Expect to be proper address', async () => {
      expect('0x28FAA621c3348823D6c6548981a19716bcDc740e').to.be.properAddress;
      expect('0x846C66cf71C43f80403B51fE3906B3599D63336f').to.be.properAddress;
    });

    it('Expect not to be proper address', async () => {
      expect('0x28FAA621c3348823D6c6548981a19716bcDc740').to.not.be.properAddress;
      expect('0x846C66cf71C43f80403B51fE3906B3599D63336g').to.not.be.properAddress;
    });

    it('Expect to throw if invalid address', async () => {
      expect(
        () => expect('0x28FAA621c3348823D6c6548981a19716bcDc740').to.be.properAddress
      ).to.throw(AssertionError, 'Expected "0x28FAA621c3348823D6c6548981a19716bcDc740" to be a proper address');
    });

    it('Expect to throw if negation with proper address)', async () => {
      expect(
        () => expect('0x28FAA621c3348823D6c6548981a19716bcDc740e').not.to.be.properAddress
      ).to.throw(AssertionError, 'Expected "0x28FAA621c3348823D6c6548981a19716bcDc740e" not to be a proper address');
    });
  });

  describe('Proper private', () => {
    it('Expect to be proper private', async () => {
      expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5').to.be.properPrivateKey;
      expect('0x03c909455dcef4e1e981a21ffb14c1c51214906ce19e8e7541921b758221b5ae').to.be.properPrivateKey;
    });

    it('Expect not to be proper private', async () => {
      expect('0x28FAA621c3348823D6c6548981a19716bcDc740').to.not.be.properPrivateKey;
      expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7cw').to.not.be.properPrivateKey;
    });

    it('Expect to throw if invalid private', async () => {
      expect(
        () => expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c').to.be.properPrivateKey
      ).to.throw(
        AssertionError,
        'Expected "0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c" to be a proper private key'
      );
    });

    it('Expect to throw if negation with proper private)', async () => {
      expect(
        () => expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5').not.to.be.properPrivateKey
      ).to.throw(
        AssertionError,
        'Expected "0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5" not to be a proper private key'
      );
    });
  });

  describe('Proper hex', () => {
    it('Expect to be proper hex', async () => {
      expect('0x70').to.be.properHex(2);
      expect('0x03c909455d').to.be.properHex(10);
    });

    it('Expect not to be proper hex', async () => {
      expect('0x284').not.to.be.properHex(2);
      expect('0x2g').not.to.be.properHex(2);
      expect('0x03c909455dd').not.to.be.properHex(10);
      expect('0x03c909455w').not.to.be.properHex(10);
    });

    it('Expect to throw if invalid hex', async () => {
      expect(
        () => expect('0x702').to.be.properHex(2)
      ).to.throw(AssertionError, 'Expected "0x702" to be a proper hex of length 2');
    });

    it('Expect to throw if negation with proper hex)', async () => {
      expect(
        () => expect('0x70').not.to.be.properHex(2)
      ).to.throw(AssertionError, 'Expected "0x70" not to be a proper hex of length 2, but it was');
    });
  });
});
