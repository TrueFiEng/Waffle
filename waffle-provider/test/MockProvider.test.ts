import {expect} from 'chai';
import {BigNumber, utils, Wallet} from 'ethers';
import {MockProvider} from '../src/MockProvider';
import {deployToken} from './BasicToken';

describe('INTEGRATION: MockProvider', () => {
  let provider: MockProvider;

  before(async () => {
    provider = new MockProvider();
  });

  it('returns wallets', async () => {
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
      ganacheOptions: {
        accounts: [{balance: '100', secretKey: original.privateKey}]
      }
    });
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(1);
    expect(wallets[0].address).to.equal(original.address);
  });

  it('can send simple transactions', async () => {
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
    const [wallet] = provider.getWallets();
    const contract = await deployToken(wallet, 10_000);
    const totalSupply: BigNumber = await contract.totalSupply();
    expect(totalSupply.eq(10_000)).to.equal(true);
  });

  it('can send a contract transaction', async () => {
    const [sender, recipient] = provider.getWallets();
    const contract = await deployToken(sender, 10_000);
    await contract.transfer(recipient.address, 3_141);
    const balance = await contract.balanceOf(recipient.address);
    expect(balance.eq(3_141)).to.equal(true);
  });

  describe('ENS', () => {
    before(async () => {
      await provider.setupENS();
    });

    it('setups ENS', async () => {
      const wallets = provider.getWallets();
      const wallet = wallets[wallets.length - 1];
      expect(provider.network.ensAddress).to.eq(provider.ens!.ens.address);
      expect(await provider.ens!.signer.getAddress()).to.eq(wallet.address);
    });

    it('resolveName', async () => {
      const [wallet] = provider.getWallets();
      await provider.ens!.setAddressWithReverse('vlad.ethworks.test', wallet, {recursive: true});
      expect(await provider.resolveName('vlad.ethworks.test')).to.eq(wallet.address);
    });

    it('lookupAddress', async () => {
      const [wallet] = provider.getWallets();
      await provider.ens!.setAddressWithReverse('vlad.ethworks.test', wallet, {recursive: true});
      expect(await provider.lookupAddress(wallet.address)).to.eq('vlad.ethworks.test');
    });
  });
});
