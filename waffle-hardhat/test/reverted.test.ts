import {waffle} from 'hardhat';
import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {revertedTest, revertedWithTest} from '@ethereum-waffle/chai/test';
import {ContractFactory} from 'ethers';
import CustomError from '../build/contracts/CustomError.sol/Matchers.json';

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

  const deploy = async () => {
    const wallets = provider.getWallets();
    const wallet = wallets[0];
    const factory = new ContractFactory(CustomError.abi, CustomError.bytecode, wallet);
    const matchers = await factory.deploy();
    return matchers;
  };

  // Custom errors are supported by hardhat, but you need to compile smart contract using hardhat as well
  // in order for custom errors to work properly. So those tests are hardhat specific.
  describe('Custom errors', () => {
    it('Revert success', async () => {
      const matchers = await deploy();
      await expect(matchers.doRevertWithOne()).to.be.revertedWith('One');
    });

    it('Revert fail', async () => {
      const matchers = await deploy();
      await expect(expect(matchers.doRevertWithOne())
        .to.be.revertedWith('Two')
      ).to.be.eventually.rejectedWith(
        'Expected transaction to be reverted with "Two", but other reason was found: "One"'
      );
    });

    it('With args success', async () => {
      const matchers = await deploy();
      await expect(matchers.doRevertWithOne())
        .to.be.revertedWith('One')
        .withArgs(
          0,
          'message',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
        );
    });

    it('With args failure', async () => {
      const matchers = await deploy();
      await expect(expect(matchers.doRevertWithOne())
        .to.be.revertedWith('One')
        .withArgs(
          1,
          'message',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
        )
      ).to.be.eventually.rejectedWith(/Expected (")?0(")? to (be )?equal 1/i); // It may or may not have the quote marks
      await expect(expect(matchers.doRevertWithOne())
        .to.be.revertedWith('One')
        .withArgs(
          0,
          'messagr',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
        )
      ).to.be.eventually.rejectedWith('expected \'message\' to equal \'messagr\'');
      await expect(expect(matchers.doRevertWithOne())
        .to.be.revertedWith('One')
        .withArgs(
          0,
          'message',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
        )
      ).to.be.eventually.rejectedWith('expected ' +
        '\'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\'' +
        ' to equal ' +
        '\'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124\''
      );
    });

    it('With array args success', async () => {
      const matchers = await deploy();
      await expect(matchers.doRevertWithTwo())
        .to.be.revertedWith('Two')
        .withArgs(
          [1, 2, 3],
          [
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
          ]
        );
    });

    it('With array args failure', async () => {
      const matchers = await deploy();
      await expect(expect(matchers.doRevertWithTwo())
        .to.be.revertedWith('Two')
        .withArgs(
          [1, 2, 4],
          [
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
          ]
        )
      ).to.be.eventually.rejectedWith(/Expected (")?3(")? to (be )?equal 4/i); // It may or may not have the quote marks
      await expect(expect(matchers.doRevertWithTwo())
        .to.be.revertedWith('Two')
        .withArgs(
          [1, 2, 3],
          [
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
          ]
        )
      ).to.be.eventually.rejectedWith('expected ' +
        '\'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124\'' +
        ' to equal ' +
        '\'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\''
      );
    });
  });

  it('Revert success (decorated)', async () => {
    const matchers = await deploy();
    await expect(matchers.doRevertWithDecoratedCustomErrorName()).to.be.revertedWith('$__DecoratedCustomErrorName');
  });

  it('Revert fail (decorated)', async () => {
    const matchers = await deploy();
    await expect(expect(matchers.doRevertWithDecoratedCustomErrorName())
      .to.be.revertedWith('Two')
    ).to.be.eventually.rejectedWith(
      'Expected transaction to be reverted with "Two", but other reason was found: "$__DecoratedCustomErrorName"'
    );
  });

  it('With args success (decorated)', async () => {
    const matchers = await deploy();
    await expect(matchers.doRevertWithDecoratedCustomErrorName())
      .to.be.revertedWith('$__DecoratedCustomErrorName')
      .withArgs(
        0,
        'message',
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
      );
  });

  it('With args failure (decorated)', async () => {
    const matchers = await deploy();
    await expect(expect(matchers.doRevertWithDecoratedCustomErrorName())
      .to.be.revertedWith('$__DecoratedCustomErrorName')
      .withArgs(
        1,
        'message',
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
      )
    ).to.be.eventually.rejectedWith(/Expected (")?0(")? to (be )?equal 1/i); // It may or may not have the quote marks
    await expect(expect(matchers.doRevertWithDecoratedCustomErrorName())
      .to.be.revertedWith('$__DecoratedCustomErrorName')
      .withArgs(
        0,
        'messagr',
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
      )
    ).to.be.eventually.rejectedWith('expected \'message\' to equal \'messagr\'');
    await expect(expect(matchers.doRevertWithDecoratedCustomErrorName())
      .to.be.revertedWith('$__DecoratedCustomErrorName')
      .withArgs(
        0,
        'message',
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
      )
    ).to.be.eventually.rejectedWith('expected ' +
      '\'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\'' +
      ' to equal ' +
      '\'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124\''
    );
  });
});
