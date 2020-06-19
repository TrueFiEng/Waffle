import {MockProvider} from '@ethereum-waffle/provider';
import {BigNumber} from 'ethers';

describe('INTEGRATION: Balance observers', () => {
  const [sender, receiver] = new MockProvider().getWallets();

  describe('Change balance, one account', () => {
    it('Should pass when expected balance change is passed as string and is equal to an actual', async () => {
      await expect(() =>
        sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
      ).toChangeBalance(sender, '-200');
    });

    it('Should pass when expected balance change is passed as int and is equal to an actual', async () => {
      await expect(() =>
        sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
      ).toChangeBalance(receiver, 200);
    });

    it('Should pass when expected balance change is passed as BN and is equal to an actual', async () => {
      await expect(() =>
        sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
      ).toChangeBalance(receiver, BigNumber.from(200));
    });

    it('Should pass on negative case when expected balance change is not equal to an actual', async () => {
      await expect(() =>
        sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
      ).not.toChangeBalance(receiver, BigNumber.from(300));
    });

    it('Should throw when expected balance change value was different from an actual', async () => {
      await expect(
        expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).toChangeBalance(sender, '-500')
      ).rejects.toThrowError(
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
        ).not.toChangeBalance(sender, '-200')
      ).rejects.toThrowError(
        `Expected "${sender.address}" to not change balance by -200 wei`
      );
    });

    it('Should throw when not a callback is passed to expect', async () => {
      await expect(() =>
        expect(1).toChangeBalance(sender, '-200')
      ).rejects.toThrowError(
        'Expect subject should be a callback returning a Promise\n' +
        'e.g.: await expect(() => wallet.send({to: \'0xb\', value: 200})).toChangeBalance(\'0xa\', -200)'
      );
    });
  });

  describe('Change balance, multiple accounts', () => {
    it('Should pass when all expected balance changes are equal to actual values', async () => {
      await expect(() =>
        sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
      ).toChangeBalances([sender, receiver], ['-200', 200]);
    });

    it('Should pass when negated and numbers don\'t match', async () => {
      await expect(() =>
        sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
      ).not.toChangeBalances([sender, receiver], [-201, 200]);
      await expect(() =>
        sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
      ).not.toChangeBalances([sender, receiver], [-200, 201]);
    });

    it('Should throw when expected balance change value was different from an actual for any wallet', async () => {
      await expect(
        expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).toChangeBalances([sender, receiver], [-200, 201])
      ).rejects.toThrowError(
        'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
          'to change balance by -200,201 wei, but it has changed by -200,200 wei'
      );
      await expect(
        expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).toChangeBalances([sender, receiver], [-201, 200])
      ).rejects.toThrowError(
        'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
          'to change balance by -201,200 wei, but it has changed by -200,200 wei'
      );
    });

    it('Should throw in negative case when expected balance changes value were equal to an actual', async () => {
      await expect(
        expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).not.toChangeBalances([sender, receiver], [-200, 200])
      ).rejects.toThrowError(
        'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
          'to not change balance by -200,200 wei'
      );
    });

    it('Should throw when not a callback is passed to expect', async () => {
      expect(() =>
        expect(
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).toChangeBalances([sender, receiver], ['-200', 200])
      ).rejects.toThrowError(
        /* eslint-disable max-len */
        'Expect subject should be a callback returning the Promise' +
        'e.g.: await expect(() => wallet.send({to: \'0xb\', value: 200})).to.changeBalances([\'0xa\', \'0xb\'], [-200, 200])'
        /* eslint-enable max-len */
      );
    });
  });
});
