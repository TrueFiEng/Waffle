import {expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';

describe('INTEGRATION: ethCalled', () => {
  it('checks that contract was called', async () => {
    const provider = new MockProvider();
    const [deployer] = provider.getWallets();

    const factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, deployer);
    const contract = await factory.deploy();

    await contract.emitOne();

    expect(contract).to.be.ethCalled;
  });
});
