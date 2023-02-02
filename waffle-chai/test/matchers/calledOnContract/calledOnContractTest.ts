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
    ).to.throw(AssertionError, 'Expected contract function callWithoutParameter to be called');
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
    ).to.throw(AssertionError, 'Expected contract function callWithoutParameter NOT to be called');
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

  it('Checks if function called from another contract was called', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    await secondDeployContract.forwardCallWithoutParameter(contract.address);

    expect('callWithoutParameter').to.be.calledOnContract(contract);
    expect('callWithoutParameter').not.to.be.calledOnContract(secondDeployContract);
  });

  it('Throws if expcted function to be called from another contract but it was not', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    await secondDeployContract.callWithoutParameter();

    expect(
      () => expect('callWithoutParameter').to.be.calledOnContract(contract)
    ).to.throw(AssertionError, 'Expected contract function callWithoutParameter to be called');
    expect('callWithoutParameter').to.be.calledOnContract(secondDeployContract);
    expect('callWithoutParameter').not.to.be.calledOnContract(contract);
  });
};
