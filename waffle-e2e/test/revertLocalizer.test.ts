import {expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory, constants} from 'ethers';
import BasicToken from '../dist/BasicToken.json';
import HelloContract from '../dist/HelloContract.json';

describe('Integration: RevertLocalizer', () => {
  it('finds source location on estimate gas', async () => {
    const provider = new MockProvider();
    provider.buildDir = './dist';
    const [sender] = provider.getWallets();
    const factory = new ContractFactory(BasicToken.abi, BasicToken.bytecode, sender);
    const contract = await factory.deploy(10_000);
    await expect(contract.transfer(constants.AddressZero, 50)).to.be.rejectedWith(/BasicToken\.sol:30/);
  });

  it('does not find a revert location for contracts called by the called contract', async () => {
    const provider = new MockProvider();
    provider.buildDir = './dist';
    const [sender] = provider.getWallets();
    const factory = new ContractFactory(HelloContract.abi, HelloContract.bytecode, sender);
    const contract = await factory.deploy();
    await expect(contract.doRevert()).to.be.rejectedWith('VM Exception while processing transaction: revert bar');
  });
});
