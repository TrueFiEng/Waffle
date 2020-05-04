import {expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {AddressZero} from 'ethers/constants';
import BasicToken from '../dist/BasicToken.json';
import HelloContract from '../dist/HelloContract.json';

describe('Integration: RevertLocalizer', () => {
  it('finds source location on estimate gas', async () => {
    const provider = new MockProvider();
    provider.buildDir = './dist';
    const [sender] = provider.getWallets();
    const factory = new ContractFactory(BasicToken.abi, BasicToken.bytecode, sender);
    const contract = await factory.deploy(10_000);
    await expect(contract.transfer(AddressZero, 50)).to.be.rejectedWith(/BasicToken\.sol:30/);
  });

  it('finds source location in dependency contract', async () => {
    const provider = new MockProvider();
    provider.buildDir = './dist';
    const [sender] = provider.getWallets();
    const factory = new ContractFactory(HelloContract.abi, HelloContract.bytecode, sender);
    const contract = await factory.deploy();
    await expect(contract.doRevert()).to.be.rejectedWith(/TestContract\.sol:14/);
  });
});
