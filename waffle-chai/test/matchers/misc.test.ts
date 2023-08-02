import {MockProvider} from '@ethereum-waffle/provider';
import {expect, AssertionError} from 'chai';
import {BigNumber, ContractFactory, ethers} from 'ethers';
import {MATCHERS_ABI, MATCHERS_BYTECODE} from '../contracts/Matchers';

describe('UNIT: Miscellaneous', () => {
  let provider: MockProvider;

  before(async () => {
    provider = new MockProvider();
  });

  const setup = async () => {
    const [deployer] = provider.getWallets();

    const factory = new ContractFactory(MATCHERS_ABI, MATCHERS_BYTECODE, deployer);
    return {contract: await factory.deploy()};
  };

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

  describe('Other chai matchers compatibility', () => {
    it('lengthOf works', async () => {
      const one = ethers.constants.One;
      const list = [1, 2, 3];

      expect(one).to.be.at.least(1);

      expect(list.length).to.be.at.least(one);
      expect(list).to.have.lengthOf.at.least(1);
      expect([1]).to.have.lengthOf.at.least(one);
      expect(list).to.have.lengthOf.at.least(one);
      expect(list).to.have.lengthOf.at.most(one.mul(3));
      expect(() => expect(list).to.have.lengthOf.at.most(one)).to.throw;
    });

    it('deep.equal works', async () => {
      const {contract} = await setup();
      const tuple = await contract.getTuple();
      expect(tuple).to.deep.equal(['0xb319771f2dB6113a745bCDEEa63ec939Bf726207', BigInt(9771)]);
    });
  });
});
