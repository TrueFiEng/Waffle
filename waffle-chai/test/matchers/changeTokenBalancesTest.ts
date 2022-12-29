import {expect, AssertionError} from 'chai';
import {Wallet, Contract, ContractFactory} from 'ethers';
import {MOCK_TOKEN_ABI, MOCK_TOKEN_BYTECODE} from '../contracts/MockToken';

import type {TestProvider} from '@ethereum-waffle/provider';

export const changeTokenBalancesTest = (provider: TestProvider) => {
  let sender: Wallet;
  let receiver: Wallet;
  let token: Contract;
  let factory: ContractFactory;

  before(async () => {
    const wallets = provider.getWallets();
    sender = wallets[0];
    receiver = wallets[1];
    factory = new ContractFactory(MOCK_TOKEN_ABI, MOCK_TOKEN_BYTECODE, sender);
    token = await factory.deploy('MockToken', 'Mock', 18, 1000000000);
  });

  describe('Change token balance, multiple accounts', () => {
    it('Should pass when all expected balance changes are equal to actual values', async () => {
      await expect(() =>
        token.transfer(receiver.address, 200)
      ).to.changeTokenBalances(token, [sender, receiver], ['-200', 200]);
    });

    it('Works with addresses passed as strings', async () => {
      await expect(() =>
        token.transfer(receiver.address, 200)
      ).to.changeTokenBalances(token, [sender.address, receiver.address], ['-200', 200]);
    });

    it('Should pass when negated and numbers don\'t match', async () => {
      await expect(() =>
        token.transfer(receiver.address, 200)
      ).to.not.changeTokenBalances(token, [sender, receiver], [-201, 200]);
      await expect(() =>
        token.transfer(receiver.address, 200)
      ).to.not.changeTokenBalances(token, [sender, receiver], [-200, 201]);
    });

    it('Should throw when expected balance change value was different from an actual for any wallet', async () => {
      await expect(
        expect(() =>
          token.transfer(receiver.address, 200)
        ).to.changeTokenBalances(token, [sender, receiver], [-200, 201])
      ).to.be.eventually.rejectedWith(
        AssertionError,
        `Expected ${sender.address},${receiver.address} ` +
            'to change balance by -200,201 wei, but it has changed by -200,200 wei'
      );

      await expect(
        expect(() =>
          token.transfer(receiver.address, 200)
        ).to.changeTokenBalances(token, [sender, receiver], [-201, 200])
      ).to.be.eventually.rejectedWith(
        AssertionError,
        `Expected ${sender.address},${receiver.address} ` +
            'to change balance by -201,200 wei, but it has changed by -200,200 wei'
      );
    });

    it('Should throw in negative case when expected balance changes value were equal to an actual', async () => {
      await expect(
        expect(() =>
          token.transfer(receiver.address, 200)
        ).to.not.changeTokenBalances(token, [sender, receiver], [-200, 200])
      ).to.be.eventually.rejectedWith(
        AssertionError,
        `Expected ${sender.address},${receiver.address} ` +
            'to not change balance by -200,200 wei'
      );
    });
  });

  describe('changeTokenBalances - error margin', () => {
    it('positive', async () => {
      await expect(token.transfer(receiver.address, 200))
        .to.changeTokenBalances(token, [receiver, sender], [100, -100], 100);
    });

    it('negative', async () => {
      await expect(token.transfer(receiver.address, 200))
        .to.not.changeTokenBalances(token, [receiver, sender], [100, -100], 99);
    });

    it('Describes margin in the error message', async () => {
      await expect(

        expect(await token.transfer(receiver.address, 200))
          .to.changeTokenBalances(token, [receiver, sender], [250, -250], 40)

      ).to.eventually.rejectedWith(
        AssertionError,
        `Expected ${receiver.address},${sender.address} to change balance by 250,-250 ± 40 wei, ` +
        'but it has changed by 200,-200 wei'
      );
    });
  });
};
