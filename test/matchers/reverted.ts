import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from '../../lib/waffle';
import Matchers from './build/Matchers.json';
import { Contract } from 'ethers';

chai.use(solidity);
chai.use(chaiAsPromised);

const {expect} = chai;

const alwaysReject = new Promise((resolve, reject) => {
  reject('Random reason');
});

describe('INTEGRATION: Matchers: reverted', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let matchers: Contract;

  beforeEach(async () => {
    matchers = await deployContract(wallet, Matchers);
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
    ).to.be.eventually.rejected;
  });

  it('Revert: fail, random exception', async () => {
    await expect(alwaysReject).not.to.be.reverted;
  });

  it('Not to revert: fail, random exception', async () => {
    await expect(
      expect(alwaysReject).to.be.reverted
    ).to.be.eventually.rejected;
  });
});

describe('INTEGRATION: Matchers: revertedWith', () => {
  let provider;
  let matchers: Contract;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    matchers = await deployContract(wallet, Matchers);
  });

  it('Throw: success', async () => {
    await expect(matchers.doThrow()).to.be.revertedWith('');
  });

  it('Not to revert: success', async () => {
    await expect(matchers.doNothing()).not.to.be.revertedWith('');
  });

  it('Revert with modification: success', async () => {
    await expect(matchers.doRevertAndModify()).to.be.revertedWith('Revert cause');
  });

  it('ThrowAndModify: success', async () => {
    await expect(matchers.doThrowAndModify()).to.be.revertedWith('');
  });

  it('Revert: success', async () => {
    await expect(matchers.doRevert()).to.be.revertedWith('Revert cause');
  });

  it('Revert: fail when different message was thrown', async () => {
    await expect(expect(matchers.doRevert()).to.be.revertedWith('Different message')).to.be.eventually.rejected;
  });

  it('Revert: fail no exception', async () => {
    await expect(
      expect(matchers.doNothing()).to.be.revertedWith('')
    ).to.be.eventually.rejected;
  });

  it('Require: success', async () => {
    await expect(matchers.doRequireFail()).to.be.revertedWith('Require cause');
  });

  it('Require: fail when no exception was thrown', async () => {
    await expect(expect(matchers.doRequireSuccess()).to.be.revertedWith('Never to be seen')).to.be.eventually.rejected;
  });

  it('Require: fail when different message', async () => {
    await expect(expect(matchers.doRequireFail()).to.be.revertedWith('Different message')).to.be.eventually.rejected;
  });

  it('Not to revert: fail', async () => {
    await expect(
      expect(matchers.doThrow()).not.to.be.revertedWith('')
    ).to.be.eventually.rejected;
  });

  it('Revert: fail when same message was thrown', async () => {
    await expect(matchers.doRevert()).to.be.revertedWith('Revert cause');
  });

  it('Not to revert: success when different message was thrown', async () => {
    await expect(matchers.doRevert()).not.to.be.revertedWith('Different message');
  });

  it('Revert: fail, random exception', async () => {
    await expect(alwaysReject).not.to.be.revertedWith('Random reason');
  });

  it('Not to revert: fail, random exception', async () => {
    await expect(
      expect(alwaysReject).to.be.revertedWith('Random reason')
    ).to.be.eventually.rejected;
  });
});
