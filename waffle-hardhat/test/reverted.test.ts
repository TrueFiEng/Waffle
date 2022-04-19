import {waffle} from 'hardhat';
import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {revertedTest, revertedWithTest} from '@ethereum-waffle/chai/test';
import {ContractFactory} from 'ethers';
import {abi, bytecode} from '../build/contracts/Panic.sol/Panic.json';

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
});

it('Panic code', async () => {
  await waffle.provider.send('hardhat_reset', []);
  const wallets = waffle.provider.getWallets();
  const wallet = wallets[0];
  const factory = new ContractFactory(abi, bytecode, wallet);
  const panicContract = await factory.deploy();
  await expect(panicContract.panic()).to.be.revertedWith('panic code 0x32');
});
