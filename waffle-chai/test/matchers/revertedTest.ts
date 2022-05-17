import {expect} from 'chai';
import {Wallet, Contract, ContractFactory} from 'ethers';
import {MATCHERS_ABI, MATCHERS_BYTECODE} from '../contracts/Matchers';

import type {TestProvider} from '@ethereum-waffle/provider';

export const revertedTest = (provider: TestProvider) => {
  let wallet: Wallet;
  let matchers: Contract;

  before(async () => {
    const wallets = provider.getWallets();
    wallet = wallets[0];
  });

  beforeEach(async () => {
    const factory = new ContractFactory(MATCHERS_ABI, MATCHERS_BYTECODE, wallet);
    matchers = await factory.deploy();
  });

  it('Modify: Success', async () => {
    await expect(matchers.doModify()).not.to.be.reverted;
  });

  it('Modify: Fail', async () => {
    await expect(
      expect(matchers.doModify()).to.be.reverted
    ).to.be.eventually.rejectedWith('Expected transaction to be reverted');
  });

  it('Throw: success', async () => {
    await expect(matchers.doThrow()).to.be.reverted;
  });

  it('Not to revert: success', async () => {
    await expect(matchers.doNothing()).not.to.be.reverted;
  });

  it('Revert with modification: success', async () => {
    await expect(matchers.doRevertAndModify()).to.be.reverted;
  });

  it('ThrowAndModify: success', async () => {
    await expect(matchers.doThrowAndModify()).to.be.reverted;
  });

  it('Revert: success', async () => {
    await expect(matchers.doRevert()).to.be.reverted;
  });

  it('Revert: fail no exception', async () => {
    await expect(
      expect(matchers.doNothing()).to.be.reverted
    ).to.be.eventually.rejected;
  });

  it('Not to revert: fail', async () => {
    await expect(
      expect(matchers.doThrow()).not.to.be.reverted
      // eslint-disable-next-line max-len
    ).to.be.eventually.rejectedWith(/Expected transaction NOT to be reverted, but it was reverted with/);
  });

  it('Revert: fail, random exception', async () => {
    await expect(Promise.reject('Always reject')).not.to.be.reverted;
  });

  it('Not to revert: fail, random exception', async () => {
    await expect(
      expect(Promise.reject('Always reject')).to.be.reverted
    ).to.be.eventually.rejected;
  });
};
