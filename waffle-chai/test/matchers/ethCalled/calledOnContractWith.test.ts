import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';
import {AssertionError, expect} from 'chai';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: calledOnContractWith', () => {
  it('checks that contract function with provided parameter was called', async () => {
    const {contract} = await setup();

    await contract.callWithParameter(1);

    expect('callWithParameter').to.be.calledOnContractWith(contract, [1]);
  });

  it('checks that contract function with provided multiple parameters was called', async () => {
    const {contract} = await setup();

    await contract.callWithParameters(2, 3);

    expect('callWithParameters').to.be.calledOnContractWith(contract, [2, 3]);
  });

  it('throws assertion error when contract function with parameter was not called', async () => {
    const {contract} = await setup();

    expect(
      () => expect('callWithParameter').to.be.calledOnContractWith(contract, [1])
    ).to.throw(AssertionError, 'Expected contract function with parameters to be called');
  });

  it('checks that contract function with parameter was not called', async () => {
    const {contract} = await setup();

    await contract.callWithParameter(2);

    expect('callWithParameter').not.to.be.to.be.calledOnContractWith(contract, [1]);
  });

  it('checks that contract function with parameters was not called', async () => {
    const {contract} = await setup();

    await contract.callWithParameters(1, 2);

    expect('callWithParameters').not.to.be.to.be.calledOnContractWith(contract,[1, 3]);
  });

  it('throws assertion error when contract function with parameter was called', async () => {
    const {contract} = await setup();
    await contract.callWithParameter(2);

    expect(
      () => expect('callWithParameter').not.to.be.calledOnContractWith(contract,[2])
    ).to.throw(AssertionError, 'Expected contract function with parameters NOT to be called');
  });
});
