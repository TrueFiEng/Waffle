import {expect, AssertionError} from 'chai';
import {Wallet, Contract, ContractFactory, BigNumber} from 'ethers';
import {MOCK_TOKEN_ABI, MOCK_TOKEN_BYTECODE} from '../contracts/MockToken';

import type {TestProvider} from '@ethereum-waffle/provider';

export const changeTokenBalanceTest = (provider: TestProvider) => {
  let sender: Wallet;
  let receiver: Wallet;
  let token: Contract;
  let contract: Contract;
  let factory: ContractFactory;

  before(async () => {
    const wallets = provider.getWallets();
    sender = wallets[0];
    receiver = wallets[1];
    contract = new Contract(receiver.address, [], provider);
    factory = new ContractFactory(MOCK_TOKEN_ABI, MOCK_TOKEN_BYTECODE, sender);
    token = await factory.deploy('MockToken', 'Mock', 18, 1000000000);
  });

  describe('Change token balance, one account', () => {
    it('Should pass when transferred from is used and expected balance change is equal to an actual', async () => {
      await token.approve(receiver.address, 200);
      const connectedToken = token.connect(receiver);
      await expect(() =>
        connectedToken.transferFrom(sender.address, receiver.address, 200)
      ).to.changeTokenBalance(token, receiver, 200);
    });

    it('Works with address passed as a string', async () => {
      await token.approve(receiver.address, 200);
      const connectedToken = token.connect(receiver);
      await expect(() =>
        connectedToken.transferFrom(sender.address, receiver.address, 200)
      ).to.changeTokenBalance(token, receiver.address, 200);
    });

    it('Should pass when expected balance change is passed as string and is equal to an actual', async () => {
      await expect(() =>
        token.transfer(receiver.address, 200)
      ).to.changeTokenBalance(token, sender, '-200');
    });

    it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
      await expect(() =>
        token.transfer(receiver.address, 200)
      ).to.changeTokenBalance(token, receiver, 200);
    });

    it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
      await expect(() =>
        token.transfer(receiver.address, 200)
      ).to.changeTokenBalance(token, receiver, BigInt(200));
    });

    it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
      await expect(() =>
        token.transfer(receiver.address, 200)
      ).to.not.changeTokenBalance(token, receiver, BigInt(300));
    });

    it('Should throw when expected balance change value was different from an actual', async () => {
      await expect(
        expect(() =>
          token.transfer(receiver.address, 200)
        ).to.changeTokenBalance(token, sender, '-500')
      ).to.be.eventually.rejectedWith(
        AssertionError,
        `Expected "${sender.address}" to change balance by -500 wei, but it has changed by -200 wei`
      );
    });

    it('Should throw in negative case when expected balance change value was equal to an actual', async () => {
      await expect(
        expect(() =>
          token.transfer(receiver.address, 200)
        ).to.not.changeTokenBalance(token, sender, '-200')
      ).to.be.eventually.rejectedWith(
        AssertionError,
        `Expected "${sender.address}" to not change balance by -200 wei`
      );
    });
  });

  describe('Change token balance, one contract', () => {
    it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
      await expect(async () =>
        token.transfer(receiver.address, 200)
      ).to.changeTokenBalance(token, contract, 200);
    });
  });

  describe('ChangeTokenBalance - error margin', () => {
    it('positive', async () => {
      await expect(token.transfer(receiver.address, 200))
        .to.changeTokenBalance(token, receiver, 100, 100);

      await expect(token.transfer(receiver.address, 200))
        .to.changeTokenBalance(token, receiver, 300, 100);
    });

    it('negative', async () => {
      await expect(token.transfer(receiver.address, 200))
        .to.not.changeTokenBalance(token, receiver, 100, 99);

      await expect(token.transfer(receiver.address, 200))
        .to.not.changeTokenBalance(token, receiver, 300, 99);
    });

    describe('Throws', () => {
      it('too high', async () => {
        await expect(

          expect(await token.transfer(receiver.address, 300))
            .to.changeTokenBalance(token, receiver, 250, 40)

        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${receiver.address}" balance to change within [210,290] wei, ` +
          'but it has changed by 300 wei'
        );
      });

      it('too low', async () => {
        await expect(

          expect(await token.transfer(receiver.address, 200))
            .to.changeTokenBalance(token, receiver, 250, 40)

        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${receiver.address}" balance to change within [210,290] wei, ` +
          'but it has changed by 200 wei'
        );
      });

      it('negated', async () => {
        await expect(

          expect(await token.transfer(receiver.address, 260))
            .to.not.changeTokenBalance(token, receiver, 250, 40)

        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${receiver.address}" balance to not change within [210,290] wei`
        );
      });
    });
  });
};
