import {MockProvider} from '../src';
import {ContractFactory} from 'ethers';
import BasicToken from './test-build-output/BasicToken.json';
import {expect} from 'chai';
import {AddressZero} from 'ethers/constants';

describe('Integration: RevertLocalizer', () => {
  it('finds source location on estimate gas', async () => {
    const provider = new MockProvider();
    provider.buildDir = 'test/test-build-output';
    const [sender] = provider.getWallets();
    const factory = new ContractFactory(BasicToken.abi, BasicToken.bytecode, sender);
    const contract = await factory.deploy(10_000);
    await expect(contract.transfer(AddressZero, 50)).to.be.rejectedWith(/BasicToken\.sol:30/);
  });
});
