import {expect, use} from 'chai';
import {MockProvider, solidity} from 'ethereum-waffle';

use(solidity);

describe('BasicToken', () => {
  const [walletFrom, walletTo] = new MockProvider().getWallets();

  it('Change balance of receiver wallet', async () => {
    await expect(() =>
      walletFrom.sendTransaction({
        to: walletTo.address,
        gasPrice: 0,
        value: 200
      })
    ).to.changeBalance(walletTo, 200);
  });

  it('Change balance of receiver and sander wallets', async () => {
    await expect(() =>
      walletFrom.sendTransaction({
        to: walletTo.address,
        gasPrice: 0,
        value: 200
      })
    ).to.changeBalances([walletFrom, walletTo], [-200, 200]);
  });
});
