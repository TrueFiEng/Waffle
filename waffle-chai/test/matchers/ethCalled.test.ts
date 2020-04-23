import {expect, AssertionError} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: ethCalled', () => {
  it('checks that contract was called', async () => {
    const {contract} = await setup();

    await contract.emitOne();

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
    await contract.emitOne();
    expect(
      () => expect(contract).not.to.be.ethCalled
    ).to.throw(AssertionError, 'Expected contract NOT to be called');
  });
});
