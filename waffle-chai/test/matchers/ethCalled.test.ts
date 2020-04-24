import {expect, AssertionError} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {Contract, ContractFactory, constants, getDefaultProvider} from 'ethers';
import {CALLS_ABI, CALLS_BYTECODE} from '../contracts/Calls';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: ethCalled', () => {
  describe('types check', () => {
    it('throws type error when the argument is not a contract', async () => {
      expect(
        () => expect('not a contract').to.be.ethCalled
      ).to.throw(TypeError, 'ethCalled: argument must be a contract');
    });

    it('throws type error when the argument is not a provider', async () => {
      const contract = new Contract(
        constants.AddressZero,
        [],
        getDefaultProvider()
      );

      expect(
        () => expect(contract).to.be.ethCalled
      ).to.throw(TypeError, 'ethCalled: contract.provider must be a MockProvider');
    });

    it('throws type error when the provided function is not a string', async () => {
      const {contract} = await setup();

      expect(
        () => expect([contract, 12]).to.be.ethCalled
      ).to.throw(TypeError, 'ethCalled: function name must be a string');
    });

    it('throws error when the provided function is not in the contract', async () => {
      const {contract} = await setup();

      expect(
        () => expect([contract, 'notExistingFunction']).to.be.ethCalled
      ).to.throw(TypeError, 'ethCalled: function must exist in provided contract');
    });

    it('throws error when the provided function is from another contract', async () => {
      const provider = new MockProvider();
      const [deployer] = provider.getWallets();
      const factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, deployer);
      const contract = await factory.deploy();

      await contract.emitOne();

      expect(
        () => expect([contract, 'notExistingFunction']).to.be.ethCalled
      ).to.throw(TypeError, 'ethCalled: function must exist in provided contract');
    });
  });

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
