import {expect, AssertionError} from 'chai';
import {BigNumber, Contract} from 'ethers';
import { describeMockProviderCases } from './MockProviderCases';

const TX_GAS = 21000; // Gas used by a single, non-contract transaction.
/**
 * Hardfork London - baseFeePerGas is replacing gasPrice.
 * A default minimum in Ganache is this number.
 * It cannot be set to 0 at this time.
 */
const BASE_FEE_PER_GAS = 875000000

describeMockProviderCases('INTEGRATION: changeBalance matcher', (provider) => {
  const [sender, receiver] = provider.getWallets();
  const contract = new Contract(receiver.address, [], provider);

  describe('Transaction Callback', () => {
    describe('Change balance, one account', () => {
      it('Should pass when expected balance change is passed as string and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.changeBalance(receiver, '200');
      });

      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.changeBalance(receiver, 200);
      });

      it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.changeBalance(receiver, BigNumber.from(200));
      });

      it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.not.changeBalance(receiver, BigNumber.from(300));
      });

      it('Should take into account transaction fee', async () => {
        const gasFees = BASE_FEE_PER_GAS * TX_GAS;
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: BASE_FEE_PER_GAS,
            value: 200
          })
        ).to.changeBalance(sender, -(gasFees + 200));
      });

      it('Should throw when expected balance change value was different from an actual', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              value: 200
            })
          ).to.changeBalance(receiver, '500')
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${receiver.address}" to change balance by 500 wei, but it has changed by 200 wei`
        );
      });

      it('Should throw in negative case when expected balance change value was equal to an actual', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              value: 200
            })
          ).to.not.changeBalance(receiver, '200')
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${receiver.address}" to not change balance by 200 wei`
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
        ).to.changeBalance(contract, 200);
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
        ).to.changeBalance(receiver, '200');
      });

      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.changeBalance(receiver, 200);
      });

      it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.changeBalance(receiver, BigNumber.from(200));
      });

      it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.not.changeBalance(receiver, BigNumber.from(300));
      });

      it('Should throw when expected balance change value was different from an actual', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
          ).to.changeBalance(receiver, '500')
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${receiver.address}" to change balance by 500 wei, but it has changed by 200 wei`
        );
      });

      it('Should throw in negative case when expected balance change value was equal to an actual', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
          ).to.not.changeBalance(receiver, '200')
        ).to.be.eventually.rejectedWith(
          AssertionError,
          `Expected "${receiver.address}" to not change balance by 200 wei`
        );
      });
    });

    describe('Change balance, one contract', () => {
      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: contract.address,
          value: 200
        })
        ).to.changeBalance(contract, 200);
      });
    });
  });
});
