import {expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory, constants} from 'ethers';
import BasicToken from '../build/BasicToken.json';

describe('Integration: RevertLocalizer', () => {
  async function setup() {
    const provider = new MockProvider();
    provider.buildDir = './dist';
    const [sender, receiver] = provider.getWallets();
    const factory = new ContractFactory(BasicToken.abi, BasicToken.bytecode, sender);
    const contract = await factory.deploy(10_000);
    return {sender, receiver, contract};
  }

  it('finds source location on estimate gas', async () => {
    const {contract} = await setup();
    await expect(contract.transfer(constants.AddressZero, 50)).to.be.rejectedWith(/BasicToken\.sol:30/);
  });

  it('does not find a revert location for contracts called by the called contract', async () => {
    const {contract} = await setup();
    await expect(contract.makeRevertFromDependentContract())
      .to.be.rejectedWith('VM Exception while processing transaction: revert bar');
  });
});
