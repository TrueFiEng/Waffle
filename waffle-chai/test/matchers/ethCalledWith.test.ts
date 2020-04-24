import {MockProvider} from '@ethereum-waffle/provider';
import {constants, Contract, ContractFactory, getDefaultProvider} from 'ethers';
import {CALLS_ABI, CALLS_BYTECODE} from '../contracts/Calls';
import {AssertionError, expect} from 'chai';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: ethCalledWith', () => {
  describe('types check', () => {
    it('throws type error when the argument is not a contract', async () => {
      expect(
        () => expect(['not a contract', 'callWithParameter']).to.be.ethCalledWith([1])
      ).to.throw(TypeError, 'ethCalled: argument must be a contract');
    });

    it('throws type error when the argument is not a provider', async () => {
      const contract = new Contract(
        constants.AddressZero,
        [],
        getDefaultProvider()
      );

      expect(
        () => expect([contract, 'callWithParameter']).to.be.ethCalledWith([1])
      ).to.throw(TypeError, 'ethCalled: contract.provider must be a MockProvider');
    });

    it('throws type error when the provided function is not a string', async () => {
      const {contract} = await setup();

      expect(
        () => expect([contract, 12]).to.be.ethCalledWith([1])
      ).to.throw(TypeError, 'ethCalled: function name must be a string');
    });

    it('throws error when the provided function is not in the contract', async () => {
      const {contract} = await setup();

      expect(
        () => expect([contract, 'notExistingFunction']).to.be.ethCalledWith([1])
      ).to.throw(TypeError, 'ethCalled: function must exist in provided contract');
    });

    it('throws error when the provided function is from another contract', async () => {
      const provider = new MockProvider();
      const [deployer] = provider.getWallets();
      const factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, deployer);
      const contract = await factory.deploy();

      await contract.emitOne();

      expect(
        () => expect([contract, 'notExistingFunction']).to.be.ethCalledWith([1])
      ).to.throw(TypeError, 'ethCalled: function must exist in provided contract');
    });
  });

  it('checks that contract function with provided parameter was called', async () => {
    const {contract} = await setup();

    await contract.callWithParameter(1);

    expect([contract, 'callWithParameter']).to.be.ethCalledWith([1]);
  });

  it('checks that contract function with provided multiple parameters was called', async () => {
    const {contract} = await setup();

    await contract.callWithParameters(2, 3);

    expect([contract, 'callWithParameters']).to.be.ethCalledWith([2, 3]);
  });

  it('throws assertion error when contract function with parameter was not called', async () => {
    const {contract} = await setup();

    expect(
      () => expect([contract, 'callWithParameter']).to.be.ethCalledWith([1])
    ).to.throw(AssertionError, 'Expected contract function with parameters to be called');
  });

  it('checks that contract function with parameter was not called', async () => {
    const {contract} = await setup();

    await contract.callWithParameter(2);

    expect([contract, 'callWithParameter']).not.to.be.to.be.ethCalledWith([1]);
  });

  it('checks that contract function with parameters was not called', async () => {
    const {contract} = await setup();

    await contract.callWithParameters(1, 2);

    expect([contract, 'callWithParameters']).not.to.be.to.be.ethCalledWith([1, 3]);
  });

  it('throws assertion error when contract function with parameter was called', async () => {
    const {contract} = await setup();
    await contract.callWithParameter(2);

    expect(
      () => expect([contract, 'callWithParameter']).not.to.be.ethCalled
    ).to.throw(AssertionError, 'Expected contract function NOT to be called');
  });
});
