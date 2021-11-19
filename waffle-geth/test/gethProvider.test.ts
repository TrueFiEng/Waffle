import {expect} from 'chai';
import {GethProvider} from '../src';
import {Wallet} from '@ethersproject/wallet';

describe('GethProvider', () => {
  const provider = new GethProvider();
  const wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82');

  it('getBlockNumber', async () => {
    expect(await provider.getBlockNumber()).to.equal(0);
  });

  it('getBalance', async () => {
    const to = Wallet.createRandom().address;
    expect(await provider.getBalance(to)).to.equal(0);
    const tx = await wallet.signTransaction({
      to: to,
      value: 123,
      nonce: 0,
      gasPrice: 875000000,
      gasLimit: 21000
    });
    await provider.sendTransaction(tx);

    expect(await provider.getBlockNumber()).to.equal(1);

    expect(await provider.getBalance(to)).to.equal(123);
  });
});
