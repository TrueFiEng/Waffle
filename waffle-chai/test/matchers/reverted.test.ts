import {expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {Contract, ContractFactory} from 'ethers';
import {MATCHERS_ABI, MATCHERS_BYTECODE} from '../contracts/Matchers';

describe('INTEGRATION: Matchers: reverted', () => {
  const [wallet] = new MockProvider().getWallets();
  let matchers: Contract;

  beforeEach(async () => {
    const factory = new ContractFactory(MATCHERS_ABI, MATCHERS_BYTECODE, wallet);
    matchers = await factory.deploy();
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
    ).to.be.eventually.rejectedWith('Expected transaction NOT to be reverted, but it was reverted with "VM Exception while processing transaction: invalid opcode"');
  });

  it('Revert: fail, random exception', async () => {
    await expect(Promise.reject('Always reject')).not.to.be.reverted;
  });

  it('Not to revert: fail, random exception', async () => {
    await expect(
      expect(Promise.reject('Always reject')).to.be.reverted
    ).to.be.eventually.rejected;
  });
});

describe('INTEGRATION: Matchers: revertedWith', () => {
  const [wallet] = new MockProvider().getWallets();
  let matchers: Contract;

  beforeEach(async () => {
    const factory = new ContractFactory(MATCHERS_ABI, MATCHERS_BYTECODE, wallet);
    matchers = await factory.deploy();
  });

  it('Throw: success', async () => {
    await expect(matchers.doThrow()).to.be.revertedWith('');
  });

  it('Throw: fail when message is expected', async () => {
    await expect(
      expect(matchers.doThrow()).to.be.revertedWith('Message other than empty string')
    ).to.eventually.be.rejected;
  });

  it('Not to revert: success', async () => {
    await expect(matchers.doNothing()).not.to.be.revertedWith('');
  });

  it('Revert with modification: success', async () => {
    await expect(matchers.doRevertAndModify()).to.be.revertedWith('Revert cause');
  });

  it('Revert with modification: fail when not full message match', async () => {
    await expect(
      expect(matchers.doRevertAndModify()).to.be.revertedWith('cause')
    ).to.eventually.be.rejected;
  });

  it('Revert with modification: fail when empty string', async () => {
    await expect(
      expect(matchers.doRevertAndModify()).to.be.revertedWith('')
    ).to.eventually.be.rejected;
  });

  it('Revert with modification: fail when different message was thrown', async () => {
    await expect(
      expect(matchers.doRevertAndModify()).to.be.revertedWith('Different message')
    ).to.eventually.be.rejected;
  });

  it('Revert with modification: fail when different message was thrown (no estimateGas call)', async () => {
    await expect(
      expect(matchers.doRevertAndModify({gasLimit: 6_000_000})).to.be.revertedWith('Different message')
    ).to.eventually.be.rejected;
  });

  it('Throw with modification: success', async () => {
    await expect(matchers.doThrowAndModify()).to.be.revertedWith('');
  });

  it('Throw with modification: success, properly handle common substring', async () => {
    // https://github.com/NomicFoundation/hardhat/issues/2234#issuecomment-1045974424
    await expect(
      expect(matchers.doThrowAndModify()).to.be.revertedWith('fa')
    ).to.eventually.be.rejectedWith('Expected transaction to be reverted with "fa", but other reason was found: ""');
  });

  it('Throw with modification: fail when message is expected', async () => {
    await expect(
      expect(matchers.doThrowAndModify()).to.be.revertedWith('Message other than empty string')
    ).to.eventually.be.rejected;
  });

  it('Throw with modification: fail when message is expected (no estimateGas call)', async () => {
    await expect(
      expect(matchers.doThrowAndModify({gasLimit: 6_000_000}))
        .to.be.revertedWith('Message other than empty string')
    ).to.eventually.be.rejected;
  });

  it('Revert: success', async () => {
    await expect(matchers.doRevert()).to.be.revertedWith('Revert cause');
  });

  it('Revert: success when message includes special symbols', async () => {
    await expect(matchers.doRevertWithComplexReason())
      .to.be.revertedWith('Revert cause (with complex reason)');
  });

  it('Revert: fail when different message was thrown', async () => {
    await expect(
      expect(matchers.doRevert()).to.be.revertedWith('Different message')
    ).to.be.eventually.rejected;
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
    await expect(
      expect(matchers.doRequireSuccess()).to.be.revertedWith('Never to be seen')
    ).to.be.eventually.rejected;
  });

  it('Require: fail when different message', async () => {
    await expect(
      expect(matchers.doRequireFail()).to.be.revertedWith('Different message')
    ).to.be.eventually.rejected;
  });

  it('Require with modification: success', async () => {
    await expect(matchers.doRequireFailAndModify()).to.be.revertedWith('Require cause');
  });

  it('Require with modification: fail when different message', async () => {
    await expect(
      expect(matchers.doRequireFailAndModify()).to.be.revertedWith('Different message')
    ).to.be.eventually.rejected;
  });

  it('Require with modification: fail when different message (no estimateGas call)', async () => {
    await expect(
      expect(matchers.doRequireFailAndModify({gasLimit: 6_000_000})).to.be.revertedWith('Different message')
    ).to.be.eventually.rejected;
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
    await expect(Promise.reject('Always reject')).not.to.be.revertedWith('Always reject');
  });

  it('Not to revert: fail, random exception', async () => {
    await expect(
      expect(Promise.reject('Always reject')).to.be.revertedWith('Always reject')
    ).to.be.eventually.rejected;
  });
});
