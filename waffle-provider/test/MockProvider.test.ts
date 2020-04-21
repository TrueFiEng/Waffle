import {expect} from 'chai';
import {utils, ContractFactory, Wallet} from 'ethers';
import {MockProvider} from '../src';
import {TOKEN_ABI, TOKEN_BYTECODE} from './BasicToken';
import BasicToken from './test-build-output/BasicToken.json';
import {AddressZero} from 'ethers/constants';

describe('INTEGRATION: MockProvider', () => {
  async function deployToken(wallet: Wallet, totalSupply: number) {
    const factory = new ContractFactory(TOKEN_ABI, TOKEN_BYTECODE, wallet);
    return factory.deploy(totalSupply);
  }

  it('fails on estimate gas', async () => {
    const provider = new MockProvider();
    provider.buildDir = 'test/test-build-output';
    const [sender] = provider.getWallets();
    const factory = new ContractFactory(BasicToken.abi, BasicToken.bytecode, sender);
    const contract = await factory.deploy(10_000);
    await expect(contract.transfer(AddressZero, 50)).to.be.rejectedWith(/BasicToken\.sol:30/);
  });

  it('can return wallets', async () => {
    const provider = new MockProvider();
    const wallets = provider.getWallets();

    expect(wallets.length).to.equal(10);
    for (const wallet of wallets) {
      const balance = await wallet.getBalance();

      expect(balance.gt(0)).to.equal(true);
      expect(wallet.provider).to.equal(provider);
    }
  });

  it('accepts options', () => {
    const original = Wallet.createRandom();
    const provider = new MockProvider({
      accounts: [{balance: '100', secretKey: original.privateKey}]
    });
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(1);
    expect(wallets[0].address).to.equal(original.address);
  });

  it('can send simple transactions', async () => {
    const provider = new MockProvider();
    const [sender] = provider.getWallets();
    const recipient = provider.createEmptyWallet();

    const value = utils.parseEther('3.1415');

    await sender.sendTransaction({
      to: recipient.address,
      value
    });

    const balance = await recipient.getBalance();
    expect(balance.eq(value)).to.equal(true);
  });

  it('can query a contract', async () => {
    const [wallet] = new MockProvider().getWallets();
    const contract = await deployToken(wallet, 10_000);

    const totalSupply: utils.BigNumber = await contract.totalSupply();
    expect(totalSupply.eq(10_000)).to.equal(true);
  });

  it('can send a contract transaction', async () => {
    const [sender, recipient] = new MockProvider().getWallets();
    const contract = await deployToken(sender, 10_000);

    await contract.transfer(recipient.address, 3_141);
    const balance = await contract.balanceOf(recipient.address);

    expect(balance.eq(3_141)).to.equal(true);
  });
});
