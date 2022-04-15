import {waffle} from 'hardhat';
import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {ContractFactory} from 'ethers';
import {revertedTest, revertedWithTest} from '@ethereum-waffle/chai/test';
import {PANIC_ABI, PANIC_BYTECODE} from '../contracts/Panic';

describe('INTEGRATION: Matchers: reverted', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  revertedTest(provider);
});

describe('INTEGRATION: Matchers: revertedWith', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  revertedWithTest(provider);

  it('Panic code', async () => {
    const wallets = provider.getWallets();
    const wallet = wallets[0];
    const factory = new ContractFactory(PANIC_ABI, PANIC_BYTECODE, wallet);
    const panicContract = await factory.deploy();
    await expect(panicContract.panic()).to.be.revertedWith('panic code 0x32');
  });
});
