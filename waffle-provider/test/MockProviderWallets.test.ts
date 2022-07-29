import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {MockProvider} from '../src/MockProvider';

describe('MockProvider - Ganache Wallets', async () => {
  const assertWalletsWithBalances = async (provider: MockProvider, wallets: Wallet[]) => {
    for (const wallet of wallets) {
      const balance = await wallet.getBalance();
      expect(balance.gt(0)).to.equal(true);
      expect(wallet.provider).to.equal(provider);
    }
  };

  it('returns default wallets', async () => {
    const provider = new MockProvider();
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(10);
    await assertWalletsWithBalances(provider, wallets);
  });

  it('accepts override of accounts', () => {
    const original = Wallet.createRandom();
    const provider = new MockProvider({
      ganacheOptions: {
        wallet: {
          accounts: [{balance: '0x64', secretKey: original.privateKey}]
        }
      }
    });
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(1);
    expect(wallets[0].address).to.equal(original.address);
  });

  it('Can generate a different number of accounts', async () => {
    const provider = new MockProvider({
      ganacheOptions: {
        wallet: {
          totalAccounts: 25
        }
      }
    });
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(25);
    await assertWalletsWithBalances(provider, wallets);
  });

  it('Can generate accounts based on a seed', async () => {
    const mnemonic = Wallet.createRandom().mnemonic;
    const provider = new MockProvider({
      ganacheOptions: {
        wallet: {
          totalAccounts: 25,
          mnemonic: mnemonic.phrase
        }
      }
    });
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(25);
    await assertWalletsWithBalances(provider, wallets);

    const defaultProvider = new MockProvider();
    expect(defaultProvider.getWallets()[0].address).to.not.be.eq(wallets[0].address);
  });

  it('Can generate wallets with non-default balance', async () => {
    const provider = new MockProvider({
      ganacheOptions: {
        wallet: {
          totalAccounts: 25,
          defaultBalance: 101
        }
      }
    });
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(25);
    await assertWalletsWithBalances(provider, wallets);
    expect((await wallets[0].getBalance()).toString()).to.eq(utils.parseEther('101').toString());
  });
});
