import {AssertionError, expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';

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
    ).to.throw(AssertionError, 'Expected contract function callWithParameter to be called');
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
    ).to.throw(AssertionError, 'Expected contract function callWithParameter not to be called ' +
      'with parameters 2, but it was');
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

  it('Checks if function called from another contract with parameter was called', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    await secondDeployContract.forwardCallWithParameter(contract.address, 2);

    expect('callWithParameter').to.be.calledOnContractWith(contract, [2]);
    expect('callWithParameter').not.to.be.calledOnContractWith(secondDeployContract, [2]);
  });

  it('Throws if expected function to be called from another contract with parameter but it was not', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    await secondDeployContract.callWithParameter(2);

    expect(
      () => expect('callWithParameter').to.be.calledOnContractWith(contract, [2])
    ).to.throw(AssertionError, 'Expected contract function callWithParameter to be called');
    expect('callWithParameter').to.be.calledOnContractWith(secondDeployContract, [2]);
    expect('callWithParameter').not.to.be.calledOnContractWith(contract, [2]);
  });

  it('Throws if function with parameter was called from another contract but the arg is wrong', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    await secondDeployContract.forwardCallWithParameter(contract.address, 2);

    expect(
      () => expect('callWithParameter').to.be.calledOnContractWith(contract, [3])
    ).to.throw(AssertionError, 'Expected contract function callWithParameter to be called with parameters 3 but' +
      ' it was called with parameters:\n2');
    expect('callWithParameter').not.to.be.calledOnContract(secondDeployContract);
  });

  it('Hides called parameters if too many', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    const calledParams: number[] = [];
    for (let i = 0; i < 10; i++) {
      if (i !== 3) {
        await secondDeployContract.forwardCallWithParameter(contract.address, i);
        calledParams.push(i);
      }
    }

    expect(
      () => expect('callWithParameter').to.be.calledOnContractWith(contract, [3])
    ).to.throw(AssertionError, 'Expected contract function callWithParameter to be called with parameters 3 but' +
      ' it was called with parameters:\n' + calledParams.slice(0, 3).join('\n') +
      '\n...and 6 more.');
    expect('callWithParameter').not.to.be.calledOnContract(secondDeployContract);
  });

  it('Checks if function called from another contract with parameters was called', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    await secondDeployContract.forwardCallWithParameters(contract.address, 2, 3);

    expect('callWithParameters').to.be.calledOnContractWith(contract, [2, 3]);
    expect('callWithParameters').not.to.be.calledOnContractWith(secondDeployContract, [2, 3]);
  });

  it('Throws if expected function to be called from another contract with parameters but it was not', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    await secondDeployContract.callWithParameters(2, 3);

    expect(
      () => expect('callWithParameters').to.be.calledOnContractWith(contract, [2, 3])
    ).to.throw(AssertionError, 'Expected contract function callWithParameters to be called');
    expect('callWithParameters').to.be.calledOnContractWith(secondDeployContract, [2, 3]);
    expect('callWithParameters').not.to.be.calledOnContractWith(contract, [2, 3]);
  });

  it('Throws if function with parameters was called from another contract but the arg is wrong', async () => {
    const {contract} = await setup(provider);
    const {contract: secondDeployContract} = await setup(provider);
    await secondDeployContract.forwardCallWithParameters(contract.address, 2, 3);

    expect(
      () => expect('callWithParameters').to.be.calledOnContractWith(contract, [2, 4])
    ).to.throw(AssertionError, 'Expected contract function callWithParameters to be called with parameters 2,4 but' +
      ' it was called with parameters:\n2,3');
    expect('callWithParameters').not.to.be.calledOnContract(secondDeployContract);
  });
};
