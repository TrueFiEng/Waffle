import {AssertionError, expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';

import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';

export const calledOnContractTest = (provider: MockProvider) => {
  const setup = async (provider: MockProvider) => {
    const [deployer] = provider.getWallets();

    const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
    return {contract: await factory.deploy()};
  };

  it('checks that contract function was called', async () => {
    const {contract} = await setup(provider);
    await contract.callWithoutParameter();

    expect('callWithoutParameter').to.be.calledOnContract(contract);
  });

  it('throws assertion error when contract function was not called', async () => {
    const {contract} = await setup(provider);

    expect(
      () => expect('callWithoutParameter').to.be.calledOnContract(contract)
    ).to.throw(AssertionError, 'Expected contract function to be called');
  });

  it('checks that contract function was not called', async () => {
    const {contract} = await setup(provider);

    expect('callWithoutParameter').not.to.be.calledOnContract(contract);
  });

  it('throws assertion error when contract function was called', async () => {
    const {contract} = await setup(provider);
    await contract.callWithoutParameter();

    expect(
      () => expect('callWithoutParameter').not.to.be.calledOnContract(contract)
    ).to.throw(AssertionError, 'Expected contract function NOT to be called');
  });

  it(
    'checks that contract function was called on provided contract and not called on another deploy of this contract',
    async () => {
      const {contract} = await setup(provider);
      const {contract: secondDeployContract} = await setup(provider);
      await contract.callWithoutParameter();

      expect('callWithoutParameter').to.be.calledOnContract(contract);
      expect('callWithoutParameter').not.to.be.calledOnContract(secondDeployContract);
    }
  );
};
