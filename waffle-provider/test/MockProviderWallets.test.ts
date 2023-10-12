import {expect} from 'chai';
import {Wallet, parseEther} from 'ethers';
import {MockProvider} from '../src/MockProvider';

describe('MockProvider - Ganache Wallets', async () => {
  const assertWalletsWithBalances = async (provider: MockProvider, wallets: Wallet[]) => {
    for (const wallet of wallets) {
      const address = await wallet.getAddress();
      const balance = await provider.getBalance(address);
      expect(balance > BigInt(0)).to.equal(true);
      expect(wallet.provider).to.equal(provider);
    }
  };

  it('returns default wallets', async () => {
    const provider = new MockProvider();
    const wallets = await provider.getWallets();
    expect(wallets.length).to.equal(10);
    await assertWalletsWithBalances(provider, wallets);
  });

  it('accepts override of accounts', async () => {
    const original = Wallet.createRandom();
    const provider = new MockProvider({
      ganacheOptions: {
        wallet: {
          accounts: [{balance: '0x64', secretKey: original.privateKey}]
        }
      }
    });
    const wallets = await provider.getWallets();
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
    const wallets = await provider.getWallets();
    expect(wallets.length).to.equal(25);
    await assertWalletsWithBalances(provider, wallets);
  });

  it('Can generate accounts based on a seed', async () => {
    const mnemonic = Wallet.createRandom().mnemonic;
    const provider = new MockProvider({
      ganacheOptions: {
        wallet: {
          totalAccounts: 25,
          mnemonic: mnemonic?.phrase
        }
      }
    });
    const wallets = await provider.getWallets();
    expect(wallets.length).to.equal(25);
    await assertWalletsWithBalances(provider, wallets);

    const defaultProvider = new MockProvider();
    expect((await defaultProvider.getWallets())[0].address).to.not.be.eq(wallets[0].address);
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
    const wallets = await provider.getWallets();
    expect(wallets.length).to.equal(25);
    await assertWalletsWithBalances(provider, wallets);
    const addr = await wallets[0].getAddress();
    const balance = await provider.getBalance(addr);
    expect(balance.toString()).to.eq(parseEther('101').toString());
  });
});
