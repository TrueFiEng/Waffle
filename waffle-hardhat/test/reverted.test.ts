import {waffle} from 'hardhat';
import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {revertedTest, revertedWithTest} from '@ethereum-waffle/chai/test';
import {ContractFactory} from 'ethers';
import Panic from '../build/contracts/Panic.sol/Panic.json';
import CustomError from '../build/contracts/CustomError.sol/Matchers.json'

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
  const factory = new ContractFactory(Panic.abi, Panic.bytecode, wallet);
  const panicContract = await factory.deploy();
  await expect(panicContract.panic()).to.be.revertedWith('panic code 0x32');
});

it('Handle custom error', async () => {
  await waffle.provider.send('hardhat_reset', []);
  const wallets = waffle.provider.getWallets();
  const wallet = wallets[0];
  const factory = new ContractFactory(CustomError.abi, CustomError.bytecode, wallet);
  const matchers = await factory.deploy();
  await expect(matchers.doRevertWithCustomError()).to.be.revertedWith('CustomError(0)');
});
