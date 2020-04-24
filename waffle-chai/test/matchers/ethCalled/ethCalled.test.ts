import {AssertionError, expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: ethCalled', () => {
  describe('match just contract', () => {
    it('checks that contract was called', async () => {
      const {contract} = await setup();
      await contract.callWithoutParameter();

      expect(contract).to.be.ethCalled;
    });

    it('throws assertion error when contract was not called', async () => {
      const {contract} = await setup();

      expect(
        () => expect(contract).to.be.ethCalled
      ).to.throw(AssertionError, 'Expected contract to be called');
    });

    it('checks that contract was not called', async () => {
      const {contract} = await setup();

      expect(contract).not.to.be.ethCalled;
    });

    it('throws assertion error when contract was called', async () => {
      const {contract} = await setup();
      await contract.callWithoutParameter();

      expect(
        () => expect(contract).not.to.be.ethCalled
      ).to.throw(AssertionError, 'Expected contract NOT to be called');
    });
  });

  describe('match contract with function', () => {
    it('checks that contract function was called', async () => {
      const {contract} = await setup();
      await contract.callWithoutParameter();

      expect([contract, 'callWithoutParameter']).to.be.ethCalled;
    });

    it('throws assertion error when contract function was not called', async () => {
      const {contract} = await setup();

      expect(
        () => expect([contract, 'callWithoutParameter']).to.be.ethCalled
      ).to.throw(AssertionError, 'Expected contract function to be called');
    });

    it('checks that contract function was not called', async () => {
      const {contract} = await setup();

      expect([contract, 'callWithoutParameter']).not.to.be.ethCalled;
    });

    it('throws assertion error when contract function was called', async () => {
      const {contract} = await setup();
      await contract.callWithoutParameter();

      expect(
        () => expect([contract, 'callWithoutParameter']).not.to.be.ethCalled
      ).to.throw(AssertionError, 'Expected contract function NOT to be called');
    });
  });
});
