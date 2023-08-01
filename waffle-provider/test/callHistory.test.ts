import {expect} from 'chai';
import {Contract, ContractFactory} from 'ethers';
import {MockProvider} from '../src/MockProvider';
import {deployToken} from './BasicToken';
import {CALLER_ABI, CALLER_BYTECODE, CALLED_ABI, CALLED_BYTECODE} from './Caller';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: MockProvider.callHistory', (provider) => {
  it('records blockchain calls', async () => {
    const [sender, recipient] = provider.getWallets();

    const contract = await deployToken(sender, 10000);
    const address = await contract.getAddress();

    await contract.transfer(recipient.address, 3_141);
    await contract.balanceOf(recipient.address);

    expect(provider.callHistory).to.deep.include.members([
      {
        address: undefined,
        data: contract.deploymentTransaction()?.data
      },
      {
        address,
        data: contract.interface.encodeFunctionData('transfer', [recipient.address, 3_141])
      },
      {
        address,
        data: contract.interface.encodeFunctionData('balanceOf', [recipient.address])
      }
    ]);
  });

  it('can be cleared', async () => {
    const provider = new MockProvider();
    const [sender, recipient] = provider.getWallets();

    const contract = await deployToken(sender, 10_000);
    const address = await contract.getAddress();
    await contract.transfer(recipient.address, 3_141);

    provider.clearCallHistory();

    await contract.balanceOf(recipient.address);

    expect(provider.callHistory).to.not.deep.include({
      address: undefined,
      data: contract.deploymentTransaction()?.data
    });
    expect(provider.callHistory).to.not.deep.include({
      address,
      data: contract.interface.encodeFunctionData('transfer', [recipient.address, 3_141])
    });
    expect(provider.callHistory).to.deep.include({
      address,
      data: contract.interface.encodeFunctionData('balanceOf', [recipient.address])
    });
  });

  it('records indirect calls', async () => {
    const provider = new MockProvider();
    const [wallet] = provider.getWallets();

    const callerFactory = new ContractFactory(CALLER_ABI, CALLER_BYTECODE, wallet);
    const caller = await callerFactory.deploy() as Contract;

    const calledFactory = new ContractFactory(CALLED_ABI, CALLED_BYTECODE, wallet);
    const called = await calledFactory.deploy() as Contract;
    const calledAddress = await called.getAddress();

    await caller.callOther(calledAddress);

    expect(provider.callHistory).to.deep.include({
      address: calledAddress,
      data: called.interface.encodeFunctionData('foo', [1, 2])
    });
  });

  it.skip('records failing calls', async () => {
    const provider = new MockProvider();
    const [wallet] = provider.getWallets();

    const token = await deployToken(wallet, 10);

    provider.clearCallHistory();
    await expect(token.transfer(wallet.address, 20)).to.be.eventually.rejected;

    expect(provider.callHistory).to.deep.include({
      address: token.address,
      data: token.interface.encodeFunctionData('transfer', [wallet.address, 20])
    });
  });
});
