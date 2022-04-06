import {AssertionError, expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory, Wallet} from 'ethers';

import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';

export const calledOnContractWithTest = (provider: MockProvider) => {
  const setup = async (provider: MockProvider) => {
    const [deployer] = provider.getWallets();

    const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
    return {contract: await factory.deploy()};
  };

  it('checks that contract function with provided parameter was called', async () => {
    const {contract} = await setup(provider);

    await contract.callWithParameter(1);

    expect('callWithParameter').to.be.calledOnContractWith(contract, [1]);
  });

  it('checks that contract function with provided multiple parameters was called', async () => {
    const {contract} = await setup(provider);

    await contract.callWithParameters(2, 3);

    expect('callWithParameters').to.be.calledOnContractWith(contract, [2, 3]);
  });

  it('throws assertion error when contract function with parameter was not called', async () => {
    const {contract} = await setup(provider);

    expect(
      () => expect('callWithParameter').to.be.calledOnContractWith(contract, [1])
    ).to.throw(AssertionError, 'Expected contract function with parameters to be called');
  });

  it('checks that contract function with parameter was not called', async () => {
    const {contract} = await setup(provider);

    await contract.callWithParameter(2);

    expect('callWithParameter').not.to.be.calledOnContractWith(contract, [1]);
  });

  it('checks that contract function with parameters was not called', async () => {
    const {contract} = await setup(provider);

    await contract.callWithParameters(1, 2);

    expect('callWithParameters').not.to.be.calledOnContractWith(contract, [1, 3]);
  });

  it('throws assertion error when contract function with parameter was called', async () => {
    const {contract} = await setup(provider);
    await contract.callWithParameter(2);

    expect(
      () => expect('callWithParameter').not.to.be.calledOnContractWith(contract, [2])
    ).to.throw(AssertionError, 'Expected contract function with parameters NOT to be called');
  });

  it(
    'checks that contract function was called on provided contract and not called on another deploy of this contract',
    async () => {
      const {contract} = await setup(provider);
      const {contract: secondDeployContract} = await setup(provider);
      await contract.callWithParameter(2);

      expect('callWithParameter').to.be.calledOnContractWith(contract, [2]);
      expect('callWithParameter').not.to.be.calledOnContractWith(secondDeployContract, [2]);
    }
  );

  it(
    'checks that contract function which was called twice with different args, lets possibility to find desirable call',
    async () => {
      const {contract} = await setup(provider);

      await contract.callWithParameters(2, 3);
      await contract.callWithParameters(4, 5);

      expect('callWithParameters').to.be.calledOnContractWith(contract, [2, 3]);
    });
};
