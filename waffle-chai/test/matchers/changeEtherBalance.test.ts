import {expect, AssertionError} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {BigNumber, Contract} from 'ethers';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = new MockProvider();
  const [sender, receiver] = provider.getWallets();
  const contract = new Contract(receiver.address, [], provider);

  describe('Transaction Callback', () => {
    describe('Change balance, one account', () => {
      it('Should pass when expected balance change is passed as string and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).to.changeEtherBalance(sender, '-200');
      });

      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            value: 200
          })
        ).to.changeEtherBalance(receiver, 200, {includeFee: true});
      });

      it('Should take into account transaction fee', async () => {
        await expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: 1,
              value: 200
            })
          ).to.changeEtherBalance(sender, -21200)
      });

      it('Should not take into account transaction fee by default', async () => {
        await expect(
          expect(() =>
              sender.sendTransaction({
                to: receiver.address,
                gasPrice: 1,
                value: 200
              })
            ).to.changeEtherBalance(sender, -200)
        ).to.be.rejectedWith(
          AssertionError,
          `Expected "${sender.address}" to change balance by -200 wei, but it has changed by -21200 wei`
        );
      });

      it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).to.changeEtherBalance(receiver, BigNumber.from(200));
      });

      it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).to.not.changeEtherBalance(receiver, BigNumber.from(300));
      });

      it('Should throw when expected balance change value was different from an actual', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: 0,
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
              gasPrice: 0,
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
            gasPrice: 0,
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
          gasPrice: 34,
          value: 200
        })
        ).to.changeEtherBalance(sender, '-200', {includeFee: true});
      });

      it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          value: 200
        })
        ).to.changeEtherBalance(receiver, 200, {includeFee: true});
      });

      it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          gasPrice: 17,
          value: 200
        })
        ).to.changeEtherBalance(sender, BigNumber.from(-200), {includeFee: true});
      });

      it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
        ).to.not.changeEtherBalance(receiver, BigNumber.from(300));
      });

      it('Should throw when expected balance change value was different from an actual', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
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
            gasPrice: 0,
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
          gasPrice: 0,
          value: 200
        })
        ).to.changeEtherBalance(contract, 200);
      });
    });
  });
})
