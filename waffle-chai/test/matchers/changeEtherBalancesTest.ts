import type {TestProvider} from '@ethereum-waffle/provider';
import {expect, AssertionError} from 'chai';
import {Contract, Wallet} from 'ethers';

interface ChangeEtherBalancesTestOptions {
  txGasFees: number | (() => number);
  baseFeePerGas: number;
}

export const changeEtherBalancesTest = (
  provider: TestProvider,
  options: ChangeEtherBalancesTestOptions
) => {
  let txGasFees: number;
  let baseFeePerGas: number;
  let sender: Wallet;
  let receiver: Wallet;
  let contractWallet: Wallet;
  let contract: Contract;

  before(() => {
    txGasFees = typeof options.txGasFees === 'function' ? options.txGasFees() : options.txGasFees;
    baseFeePerGas = options.baseFeePerGas;
    const wallets = provider.getWallets();
    sender = wallets[0];
    receiver = wallets[1];
    contractWallet = wallets[2];
    contract = new Contract(contractWallet.address, [], provider);
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

      it('Breaks in a predictable way when addresses are passed as string', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: contract.address,
              value: 200
            })
          ).to.changeEtherBalances([sender.address, contract.address], [-200, 200])
        ).to.eventually.be.rejectedWith(
          'A string address cannot be used as an account in changeEtherBalances.' +
          ' Expecting an instance of Ethers Account.'
        );
      });
    });

    describe('Change balance, multiple accounts', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: baseFeePerGas,
            value: 200
          })
        ).to.changeEtherBalances([sender, receiver], ['-200', 200]);
      });

      it('Should take into account transaction fee', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: baseFeePerGas,
            value: 200
          })
        ).to.changeEtherBalances([sender, receiver, contract], [-(txGasFees + 200), 200, 0], {includeFee: true});
      });

      it('Should pass when negated and numbers don\'t match', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: baseFeePerGas,
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
              gasPrice: baseFeePerGas,
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
              gasPrice: baseFeePerGas,
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
              gasPrice: baseFeePerGas,
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
          gasPrice: baseFeePerGas,
          value: 200
        })
        ).to.changeEtherBalances([sender, receiver], [(-(txGasFees + 200)).toString(), 200], {includeFee: true});
      });

      it('Should take into account transaction fee', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          gasPrice: baseFeePerGas,
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
            gasPrice: baseFeePerGas,
            value: 200
          })
          ).to.changeEtherBalances([sender, receiver], [-200, 200], {includeFee: true})
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected ${sender.address},${receiver.address} to change balance ` +
            `by -200,200 wei, but it has changed by -${txGasFees + 200},200 wei`
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

  describe('changeEtherBalances - error margin', () => {
    it('positive ...', async () => {
      await expect(sender.sendTransaction({
        to: receiver.address,
        value: 200
      })).to.changeEtherBalances([receiver, sender], [300, -300], {errorMargin: 100});
    });

    it('negative ...', async () => {
      await expect(sender.sendTransaction({
        to: receiver.address,
        value: 200
      })).to.not.changeEtherBalances([receiver, sender], [300, -300], {errorMargin: 99});
    });

    it('Describes margin in the error message', async () => {
      await expect(
        expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })).to.changeEtherBalances([receiver, sender], [250, -250], {errorMargin: 40})
      ).to.eventually.rejectedWith(
        AssertionError,
        `Expected ${receiver.address},${sender.address} to change balance by 250,-250 ± 40 wei, ` +
        'but it has changed by 200,-200 wei'
      );
    });
  });
};
