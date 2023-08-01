import {expect} from 'chai';
import {parseEther, ZeroAddress} from 'ethers';
import {deployToken} from './BasicToken';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: MockProvider', (provider) => {
  it('returns wallets', async () => {
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(10);
    for (const wallet of wallets) {
      const address = await wallet.getAddress();
      const balance = await provider.getBalance(address);
      expect(balance > BigInt(0)).to.equal(true);
      expect(wallet.provider).to.equal(provider);
    }
  });

  it('can send simple transactions', async () => {
    const [sender] = provider.getWallets();
    const recipient = provider.createEmptyWallet();
    const value = parseEther('3.1415');
    const tx = await sender.sendTransaction({
      to: recipient.address,
      value
    });
    await tx.wait();
    const balance = await provider.getBalance(recipient.address);
    expect(balance === BigInt(value)).to.equal(true);
  });

  it('can query a contract', async () => {
    const [wallet] = provider.getWallets();
    const contract = await deployToken(wallet, 10_000);
    const totalSupply: bigint = await contract.totalSupply();
    expect(totalSupply === BigInt(10_000)).to.equal(true);
  });

  it('can send a contract transaction', async () => {
    const [sender, recipient] = provider.getWallets();
    const contract = await deployToken(sender, 10_000);
    await (await contract.transfer(recipient.address, 3_141)).wait();
    const balance = await contract.balanceOf(recipient.address);
    expect(balance === BigInt(3_141)).to.equal(true);
  });

  it('breaks in a predictable way', async () => {
    const [wallet] = provider.getWallets();

    const token = await deployToken(wallet, 10);

    try {
      await (await token.transfer(ZeroAddress, 1)).wait();
    } catch (transactionError: any) {
      expect(String(transactionError)).to.include('transaction failed');
    }
  });

  describe.skip('ENS', () => {
    before(async () => {
      await provider.setupENS();
    });

    it('setups ENS', async () => {
      const wallets = provider.getWallets();
      const wallet = wallets[wallets.length - 1];
      expect(provider.network.ensAddress).to.eq(provider.ens.ens.address);
      expect(await provider.ens.signer.getAddress()).to.eq(wallet.address);
    });

    it('resolveName', async () => {
      const [wallet] = provider.getWallets();
      await provider.ens.setAddressWithReverse('vlad.ethworks.test', wallet, {recursive: true});
      expect(await provider.resolveName('vlad.ethworks.test')).to.eq(wallet.address);
    });

    it('lookupAddress', async () => {
      const [wallet] = provider.getWallets();
      await provider.ens.setAddressWithReverse('vlad.ethworks.test', wallet, {recursive: true});
      expect(await provider.lookupAddress(wallet.address)).to.eq('vlad.ethworks.test');
    });
  });
});
