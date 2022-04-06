import {MockProvider} from '@ethereum-waffle/provider';
import {expect, AssertionError} from 'chai';
import {Contract, Wallet} from 'ethers';

import {BASE_FEE_PER_GAS, TX_GAS} from './constants';

export const changeEtherBalancesTest = (provider: MockProvider) => {
  let sender: Wallet;
  let receiver: Wallet;
  let contractWallet: Wallet;
  let contract: Contract;
  let txGasFees: number;

  before(() => {
    const wallets = provider.getWallets();
    sender = wallets[0];
    receiver = wallets[1];
    contractWallet = wallets[2];
    contract = new Contract(contractWallet.address, [], provider);
    txGasFees = BASE_FEE_PER_GAS * TX_GAS;
  });

  describe('Transaction Callback', () => {
    describe('Change balances, one account, one contract', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: contract.address,
            value: 200
          })
        ).to.changeEtherBalances([sender, contract], [-200, 200]);
      });
    });

    describe('Change balance, multiple accounts', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: BASE_FEE_PER_GAS,
            value: 200
          })
        ).to.changeEtherBalances([sender, receiver], ['-200', 200]);
      });

      it('Should take into account transaction fee', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: BASE_FEE_PER_GAS,
            value: 200
          })
        ).to.changeEtherBalances([sender, receiver, contract], [-(txGasFees + 200), 200, 0], {includeFee: true});
      });

      it('Should pass when negated and numbers don\'t match', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: BASE_FEE_PER_GAS,
            value: 200
          })
        ).to.not.changeEtherBalances([sender, receiver], [-(txGasFees + 201), 200]);
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.not.changeEtherBalances([sender, receiver], [-200, 201], {includeFee: true});
      });

      it('Should throw when expected balance change value was different from an actual for any wallet', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: BASE_FEE_PER_GAS,
              value: 200
            })
          ).to.changeEtherBalances([sender, receiver], [-200, 201])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected ${sender.address},${receiver.address} ` +
            'to change balance by -200,201 wei, but it has changed by -200,200 wei'
        );
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: BASE_FEE_PER_GAS,
              value: 200
            })
          ).to.changeEtherBalances([sender, receiver], [-201, 200])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected ${sender.address},${receiver.address} ` +
            'to change balance by -201,200 wei, but it has changed by -200,200 wei'
        );
      });

      it('Should throw in negative case when expected balance changes value were equal to an actual', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: BASE_FEE_PER_GAS,
              value: 200
            })
          ).to.not.changeEtherBalances([sender, receiver], [-200, 200])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected ${sender.address},${receiver.address} ` +
            'to not change balance by -200,200 wei'
        );
      });
    });
  });

  describe('Transaction Response', () => {
    describe('Change balances, one account, one contract', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(await sender.sendTransaction({
          to: contract.address,
          value: 200
        })
        ).to.changeEtherBalances([sender, contract], [-200, 200]);
      });
    });

    describe('Change balance, multiple accounts', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          gasPrice: BASE_FEE_PER_GAS,
          value: 200
        })
        ).to.changeEtherBalances([sender, receiver], [(-(txGasFees + 200)).toString(), 200], {includeFee: true});
      });

      it('Should take into account transaction fee', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          gasPrice: BASE_FEE_PER_GAS,
          value: 200
        })
        ).to.changeEtherBalances([sender, receiver, contract], [-(txGasFees + 200), 200, 0], {includeFee: true});
      });

      it('Should pass when negated and numbers don\'t match', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.not.changeEtherBalances([sender, receiver], [-201, 200]);

        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.not.changeEtherBalances([sender, receiver], [-200, 201]);
      });

      it('Should throw when fee was not calculated correctly', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            gasPrice: BASE_FEE_PER_GAS,
            value: 200
          })
          ).to.changeEtherBalances([sender, receiver], [-200, 200], {includeFee: true})
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected ${sender.address},${receiver.address} to change balance ` +
            'by -200,200 wei, but it has changed by -18375000000200,200 wei'
        );
      });

      it('Should throw when expected balance change value was different from an actual for any wallet', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
          ).to.changeEtherBalances([sender, receiver], [-200, 201])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected ${sender.address},${receiver.address} ` +
            'to change balance by -200,201 wei, but it has changed by -200,200 wei'
        );

        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
          ).to.changeEtherBalances([sender, receiver], [-201, 200])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected ${sender.address},${receiver.address} ` +
            'to change balance by -201,200 wei, but it has changed by -200,200 wei'
        );
      });

      it('Should throw in negative case when expected balance changes value were equal to an actual', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
          ).to.not.changeEtherBalances([sender, receiver], [-200, 200])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected ${sender.address},${receiver.address} ` +
            'to not change balance by -200,200 wei'
        );
      });
    });
  });
};
