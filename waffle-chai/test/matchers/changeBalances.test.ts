import {expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {Contract} from 'ethers';

describe('INTEGRATION: changeBalances matcher', () => {
  const provider = new MockProvider();
  const [sender, receiver] = provider.getWallets();
  const contract = new Contract(receiver.address, [], provider);

  describe('Transaction Callback', () => {
    describe('Change balances, one account, one contract', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: contract.address,
            gasPrice: 0,
            value: 200
          })
        ).to.changeBalances([sender, contract], [-200, 200]);
      });
    });
  });

  describe('Transaction Response', () => {
    describe('Change balances, one account, one contract', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(await sender.sendTransaction({
          to: contract.address,
          gasPrice: 0,
          value: 200
        })
        ).to.changeBalances([sender, contract], [-200, 200]);
      });
    });
  });
});
