import type {TestProvider} from '@ethereum-waffle/provider';
import {expect, AssertionError} from 'chai';
import {BigNumber, Contract, Wallet} from 'ethers';

interface ChangeEtherBalanceTestOptions {
  txGasFees: number | (() => number);
  baseFeePerGas: number;
}

export const changeEtherBalanceTest = (
  provider: TestProvider,
  options: ChangeEtherBalanceTestOptions
) => {
  let txGasFees: number;
  let baseFeePerGas: number;
  let sender: Wallet;
  let receiver: Wallet;
  let contract: Contract;

  before(() => {
    txGasFees = typeof options.txGasFees === 'function' ? options.txGasFees() : options.txGasFees;
    baseFeePerGas = options.baseFeePerGas;
    const wallets = provider.getWallets();
    sender = wallets[0];
    receiver = wallets[1];
    contract = new Contract(receiver.address, [], provider);
  });

  describe('Transaction Callback', () => {
    describe('Change balance, one account', () => {
      it('Should pass when expected balance change is passed as string and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.changeEtherBalance(sender, '-200');
      });

      it('Breaks in a predictable way when addresses are passed as string', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              value: 200
            })
          ).to.changeEtherBalance(sender.address, '-200')
        ).to.eventually.be.rejectedWith(
          'A string address cannot be used as an account in changeEtherBalance.' +
          ' Expecting an instance of Ethers Account.'
        );
      });

      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.changeEtherBalance(receiver, 200);
      });

      it('Should take into account transaction fee', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: baseFeePerGas,
            value: 200
          })
        ).to.changeEtherBalance(sender, -(txGasFees + 200), {includeFee: true});
      });

      it('Should ignore fee if receiver\'s wallet is being checked and includeFee was set', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: baseFeePerGas,
            value: 200
          })
        ).to.changeEtherBalance(receiver, 200, {includeFee: true});
      });

      it('Should take into account transaction fee by default', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: baseFeePerGas,
            value: 200
          })
        ).to.changeEtherBalance(sender, -200);
      });

      it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.changeEtherBalance(receiver, BigNumber.from(200));
      });

      it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.not.changeEtherBalance(receiver, BigNumber.from(300));
      });

      it('Should throw when fee was not calculated correctly', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: baseFeePerGas,
              value: 200
            })
          ).to.changeEtherBalance(sender, -200, {includeFee: true})
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${sender.address}" to change balance by -200 wei, but it has changed by -${txGasFees + 200} wei`
        );
      });

      it('Should throw when expected balance change value was different from an actual', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              value: 200
            })
          ).to.changeEtherBalance(sender, '-500')
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${sender.address}" to change balance by -500 wei, but it has changed by -200 wei`
        );
      });

      it('Should throw in negative case when expected balance change value was equal to an actual', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              value: 200
            })
          ).to.not.changeEtherBalance(sender, '-200')
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${sender.address}" to not change balance by -200 wei`
        );
      });
    });

    describe('Change balance, one contract', () => {
      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(async () =>
          sender.sendTransaction({
            to: contract.address,
            value: 200
          })
        ).to.changeEtherBalance(contract, 200);
      });
    });
  });

  describe('Transaction Response', () => {
    describe('Change balance, one account', () => {
      it('Should pass when expected balance change is passed as string and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.changeEtherBalance(sender, '-200');
      });

      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.changeEtherBalance(receiver, 200);
      });

      it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.changeEtherBalance(sender, BigNumber.from(-200));
      });

      it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.not.changeEtherBalance(receiver, BigNumber.from(300));
      });

      it('Should throw when expected balance change value was different from an actual', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
          ).to.changeEtherBalance(sender, '-500')
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${sender.address}" to change balance by -500 wei, but it has changed by -200 wei`
        );
      });

      it('Should throw in negative case when expected balance change value was equal to an actual', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
          ).to.not.changeEtherBalance(sender, '-200')
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${sender.address}" to not change balance by -200 wei`
        );
      });
    });

    describe('Change balance, one contract', () => {
      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: contract.address,
          value: 200
        })
        ).to.changeEtherBalance(contract, 200);
      });
    });

    describe('Change balance, error margin', () => {
      it('positive', async () => {
        await expect(sender.sendTransaction({
          to: receiver.address,
          value: 200
        })).to.changeEtherBalance(receiver, 300, {errorMargin: 100});

        await expect(sender.sendTransaction({
          to: receiver.address,
          value: 200
        })).to.changeEtherBalance(receiver, 100, {errorMargin: 100});
      });

      it('negative', async () => {
        await expect(sender.sendTransaction({
          to: receiver.address,
          value: 200
        })).to.not.changeEtherBalance(receiver, 300, {errorMargin: 99});

        await expect(sender.sendTransaction({
          to: receiver.address,
          value: 200
        })).to.not.changeEtherBalance(receiver, 100, {errorMargin: 99});
      });

      describe('Throws', () => {
        it('too low', async () => {
          await expect(
            expect(await sender.sendTransaction({
              to: receiver.address,
              value: 200
            })).to.changeEtherBalance(receiver, 250, {errorMargin: 40})
          ).to.eventually.rejectedWith(
            AssertionError,
            `Expected "${receiver.address}" balance to change within [210,290] wei, ` +
            'but it has changed by 200 wei'
          );
        });

        it('too high', async () => {
          await expect(
            expect(await sender.sendTransaction({
              to: receiver.address,
              value: 300
            })).to.changeEtherBalance(receiver, 250, {errorMargin: 40})
          ).to.eventually.rejectedWith(
            AssertionError,
            `Expected "${receiver.address}" balance to change within [210,290] wei, ` +
            'but it has changed by 300 wei'
          );
        });

        it('negated', async () => {
          await expect(
            expect(await sender.sendTransaction({
              to: receiver.address,
              value: 250
            })).to.not.changeEtherBalance(receiver, 250, {errorMargin: 40})
          ).to.eventually.rejectedWith(
            AssertionError,
            `Expected "${receiver.address}" balance to not change within [210,290] wei`
          );
        });
      });
    });
  });
};
