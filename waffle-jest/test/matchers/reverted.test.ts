import {MockProvider} from '@ethereum-waffle/provider';
import {Contract, ContractFactory} from 'ethers';
import {MATCHERS_ABI, MATCHERS_BYTECODE} from '../contracts/Matchers';

describe('INTEGRATION: Matchers: reverted', () => {
  const [wallet] = new MockProvider().getWallets();
  let matchers: Contract;

  beforeEach(async () => {
    const factory = new ContractFactory(
      MATCHERS_ABI,
      MATCHERS_BYTECODE,
      wallet
    );
    matchers = await factory.deploy();
  });

  it('Throw: success', async () => {
    await expect(matchers.doThrow()).toBeReverted();
  });

  it('Not to revert: success', async () => {
    await expect(matchers.doNothing()).not.toBeReverted();
  });

  it('Revert with modification: success', async () => {
    await expect(matchers.doRevertAndModify()).toBeReverted();
  });

  it('ThrowAndModify: success', async () => {
    await expect(matchers.doThrowAndModify()).toBeReverted();
  });

  it('Revert: success', async () => {
    await expect(matchers.doRevert()).toBeReverted();
  });

  it('Revert: fail no exception', async () => {
    await expect(
      expect(matchers.doNothing()).toBeReverted()
    ).rejects.toThrowError('Expected transaction to be reverted');
  });

  it('Not to revert: fail', async () => {
    await expect(
      expect(matchers.doThrow()).not.toBeReverted()
    ).rejects.toThrowError('Expected transaction NOT to be reverted');
  });

  it('Revert: fail, random exception', async () => {
    await expect(Promise.reject('Always reject')).not.toBeReverted();
  });

  it('Not to revert: fail, random exception', async () => {
    await expect(
      expect(Promise.reject('Always reject')).toBeReverted()
    ).rejects.toThrowError(
      'Expected transaction to be reverted, but other exception was thrown: Always reject'
    );
  });
});

describe('INTEGRATION: Matchers: revertedWith', () => {
  const [wallet] = new MockProvider().getWallets();
  let matchers: Contract;

  beforeEach(async () => {
    const factory = new ContractFactory(
      MATCHERS_ABI,
      MATCHERS_BYTECODE,
      wallet
    );
    matchers = await factory.deploy();
  });

  it('Throw: success', async () => {
    await expect(matchers.doThrow()).toBeRevertedWith('');
  });

  it('Not to revert: success', async () => {
    await expect(matchers.doNothing()).not.toBeRevertedWith('');
  });

  it('Revert with modification: success', async () => {
    await expect(matchers.doRevertAndModify()).toBeRevertedWith('Revert cause');
  });

  it('ThrowAndModify: success', async () => {
    await expect(matchers.doThrowAndModify()).toBeRevertedWith('');
  });

  it('Revert: success', async () => {
    await expect(matchers.doRevert()).toBeRevertedWith('Revert cause');
  });

  it('Revert: fail when different message was thrown', async () => {
    await expect(
      expect(matchers.doRevert()).toBeRevertedWith('different message')
    ).rejects.toThrowError(
      'Expected transaction to be reverted with different message, ' +
        'but other exception was thrown: RuntimeError: VM Exception while processing transaction: revert Revert cause'
    );
  });

  it('Revert: fail no exception', async () => {
    await expect(
      expect(matchers.doNothing()).toBeRevertedWith('')
    ).rejects.toThrowError('Expected transaction to be reverted');
  });

  it('Require: success', async () => {
    await expect(matchers.doRequireFail()).toBeRevertedWith('Require cause');
  });

  it('Require: fail when no exception was thrown', async () => {
    await expect(
      expect(matchers.doRequireSuccess()).toBeRevertedWith('Never to be seen')
    ).rejects.toThrowError('Expected transaction to be reverted');
  });

  it('Require: fail when different message', async () => {
    await expect(
      expect(matchers.doRequireFail()).toBeRevertedWith('Different message')
    ).rejects.toThrowError(
      'Expected transaction to be reverted with Different message, ' +
        'but other exception was thrown: RuntimeError: VM Exception while processing transaction: revert Require cause'
    );
  });

  it('Not to revert: fail', async () => {
    await expect(
      expect(matchers.doThrow()).not.toBeRevertedWith('')
    ).rejects.toThrowError('Expected transaction NOT to be reverted with ');
  });

  it('Revert: fail when same message was thrown', async () => {
    await expect(matchers.doRevert()).toBeRevertedWith('Revert cause');
  });

  it('Not to revert: success when different message was thrown', async () => {
    await expect(matchers.doRevert()).not.toBeRevertedWith('different message');
  });

  it('Revert: fail, random exception', async () => {
    await expect(Promise.reject('Always reject')).not.toBeRevertedWith(
      'Always reject'
    );
  });

  it('Not to revert: fail, random exception', async () => {
    await expect(
      expect(Promise.reject('Always reject')).toBeRevertedWith('Always reject')
    ).rejects.toThrowError(
      'Expected transaction to be reverted with Always reject, but other exception was thrown: Always reject'
    );
  });
});
