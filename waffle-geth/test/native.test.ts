import {Wallet} from '@ethersproject/wallet';
import {expect} from 'chai';
import {cgoCurrentMillis, getBalance, getBlockNumber, sendTransaction} from '../src/native';

describe('Native', () => {
  it('can call a native function', () => {
    expect(cgoCurrentMillis()).to.be.a('number');
    expect(cgoCurrentMillis()).to.be.gt(0);
  });

  it('can get block number', () => {
    expect(getBlockNumber()).to.equal('0');
  });

  it('can send transactions', async () => {
    const wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82');
    const to = Wallet.createRandom().address;
    const tx = await wallet.signTransaction({
      to: to,
      value: 123,
      nonce: 0,
      gasPrice: 875000000,
      gasLimit: 21000
    });
    sendTransaction(tx);

    expect(getBlockNumber()).to.equal('1');

    const balance = getBalance(to);
    expect(balance).to.eq('123');
  });
});
