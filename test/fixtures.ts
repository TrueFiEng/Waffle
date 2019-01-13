import {expect} from 'chai';
import {loadFixture, createFixtureLoader} from '../lib/waffle';
import {utils, Wallet, providers} from 'ethers';

describe('Integration: Fixtures', () => {
  it('are called once per fixture', async () => {
    let countA = 0;
    let countB = 0;
    const fixtureA = async () => countA++;
    const fixtureB = async () => countB++;

    await loadFixture(fixtureA);
    await loadFixture(fixtureA);
    await loadFixture(fixtureB);
    await loadFixture(fixtureB);

    expect(countA).to.equal(1);
    expect(countB).to.equal(1);
  });

  it('allow for restoring blockchain state', async () => {
    const fixture = async (
      provider: providers.Provider,
      [wallet, other]: Wallet[]
    ) => ({wallet, other, provider});

    const {wallet, other, provider} = await loadFixture(fixture);
    const balance1 = await provider.getBalance(wallet.address);

    await wallet.sendTransaction({
      to: other.address, value: utils.parseEther('1')
    });
    const balance2 = await provider.getBalance(wallet.address);

    await loadFixture(fixture);
    const balance3 = await provider.getBalance(wallet.address);

    expect(balance1.toString()).not.to.equal(balance2.toString());
    expect(balance1.toString()).to.equal(balance3.toString());
  });

  it('loadFixture can be made to use custom provider and wallets', async () => {
    const customProvider = {send() {}} as any;
    const customWallets: Wallet[] = [];
    let fixtureArgs: any[] = [];

    const customLoadFixture = createFixtureLoader(customProvider, customWallets);
    await customLoadFixture(async (...args) => fixtureArgs = args);

    expect(fixtureArgs.length).to.equal(2);
    expect(fixtureArgs[0]).to.equal(customProvider);
    expect(fixtureArgs[1]).to.equal(customWallets);
  });
});
