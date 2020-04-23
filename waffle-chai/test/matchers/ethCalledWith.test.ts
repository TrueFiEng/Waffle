import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';
import {expect} from 'chai';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: ethCalledWith', () => {
  it('checks that contract function with provided parameters was called', async () => {
    const {contract} = await setup();

    await contract.emitParameter(1);
    await contract.emitParameters(2, 3);

    expect([contract, 'emitParameter']).to.be.ethCalledWith([1]);
    expect([contract, 'emitParameters']).to.be.ethCalledWith([2, 3]);
  });
});
