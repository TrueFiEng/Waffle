import {expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {AddressZero} from 'ethers/constants';
import BasicToken from '../test-build-output/BasicToken.json';

describe('Integration: RevertLocalizer', () => {
  it('finds source location on estimate gas', async () => {
    const provider = new MockProvider();
    provider.buildDir = './test-build-output';
    const [sender] = provider.getWallets();
    const factory = new ContractFactory(BasicToken.abi, BasicToken.bytecode, sender);
    const contract = await factory.deploy(10_000);
    await expect(contract.transfer(AddressZero, 50)).to.be.rejectedWith(/BasicToken\.sol:30/);
  });
});
