import chai, {AssertionError} from 'chai';
import {createMockProvider, getWallets, solidity} from '../../lib/waffle';
import {utils, Wallet} from 'ethers';

chai.use(solidity);
const {expect} = chai;

describe('INTEGRATION: Balance observers', () => {
  const provider = createMockProvider();
  const [sender, receiver] = getWallets(provider);

  describe('Change balance, one account', () => {
    it('Should pass when expected balance change is passed as string and is equal to an actual', async () => {
      await expect(() => sender.sendTransaction({
        to: receiver.address,
        gasPrice: 0,
        value: 200
      }))
        .to.changeBalance(sender, '-200');
    });

    it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
      await expect(() => sender.sendTransaction({
        to: receiver.address,
        gasPrice: 0,
        value: 200
      }))
        .to.changeBalance(receiver, 200);
    });

    it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
      await expect(() => sender.sendTransaction({
        to: receiver.address,
        gasPrice: 0,
        value: 200
      }))
        .to.changeBalance(receiver, utils.bigNumberify(200));
    });

    it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
      await expect(() => sender.sendTransaction({
        to: receiver.address,
        gasPrice: 0,
        value: 200
      }))
        .to.not.changeBalance(receiver, utils.bigNumberify(300));
    });

    it('Should throw when expected balance change value was different from an actual', async () => {
      await expect(
        expect(() => sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        }))
          .to.changeBalance(sender, '-500')
      ).to.be.eventually.rejectedWith(
        AssertionError,
        `Expected "${sender.address}" to change balance by -500 wei, but it has changed by -200 wei`
      );
    });

    it('Should throw in negative case when expected balance change value was equal to an actual', async () => {
      await expect(
        expect(() => sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })).to.not.changeBalance(sender, '-200')
      ).to.be.eventually.rejectedWith(AssertionError, `Expected "${sender.address}" to not change balance by -200 wei`);
    });

    it('Should throw when not a callback is passed to expect', async () => {
      await expect(() =>
        expect(1).to.changeBalance(sender, '-200')
      ).to.throw(Error, `Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalance('0xa', -200)`);
    });
  });

  describe('Change balance, multiple accounts', () => {
    it('Should pass when all expected balance changes are equal to actual values', async () => {
      await expect(() => sender.sendTransaction({
        to: receiver.address,
        gasPrice: 0,
        value: 200
      }))
        .to.changeBalances([sender, receiver], ['-200', 200]);
    });

    it('Should pass when negated and numbers don\'t match', async () => {
      await expect(() => sender.sendTransaction({
        to: receiver.address,
        gasPrice: 0,
        value: 200
      }))
        .to.not.changeBalances([sender, receiver], [-201, 200]);
      await expect(() => sender.sendTransaction({
        to: receiver.address,
        gasPrice: 0,
        value: 200
      }))
        .to.not.changeBalances([sender, receiver], [-200, 201]);
    });

    it('Should throw when expected balance change value was different from an actual for any wallet', async () => {
      await expect(
        expect(() => sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        }))
          .to.changeBalances([sender, receiver], [-200, 201])
      ).to.be.eventually.rejectedWith(
        AssertionError,
        'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
        'to change balance by -200,201 wei, but it has changed by -200,200 wei'
      );
      await expect(
        expect(() => sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        }))
          .to.changeBalances([sender, receiver], [-201, 200])
      ).to.be.eventually.rejectedWith(
        AssertionError,
        'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
        'to change balance by -201,200 wei, but it has changed by -200,200 wei'
      );
    });

    it('Should throw in negative case when expected balance changes value were equal to an actual', async () => {
      await expect(
        expect(() => sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })).to.not.changeBalances([sender, receiver], [-200, 200])
      ).to.be.eventually.rejectedWith(
        AssertionError,
        'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
        'to not change balance by -200,200 wei'
      );
    });

    it('Should throw when not a callback is passed to expect', async () => {
      expect(() =>
        expect(sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })).to.changeBalances([sender, receiver], ['-200', 200])
      ).to.throw(Error, `Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalances(['0xa', '0xb'], [-200, 200])`);
    });
  });
});
