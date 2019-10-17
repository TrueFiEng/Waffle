import {expect} from 'chai';
import {deployContract, link, createGanacheProvider, createBuidlerProvider, getWallets} from '../../lib';
import {Contract, providers} from 'ethers';
import BasicTokenMock from './build/BasicTokenMock.json';
import MyLibrary from './build/MyLibrary.json';
import LibraryConsumer from './build/LibraryConsumer.json';

const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

describe('INTEGRATION: Example', () => {
  const providerCreators = [{
    name: 'Ganache',
    createProvider: createGanacheProvider
  }, {
    name: 'Buidler',
    createProvider: createBuidlerProvider
  }];

  let provider: providers.JsonRpcProvider;

  providerCreators.forEach((providerCreator) => {
    describe(providerCreator.name, () => {
      provider = providerCreator.createProvider();
      const [wallet, walletTo] = getWallets(provider);
      let token: Contract;

      beforeEach(async () => {
        token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);
      });

      it('Assigns initial balance', async () => {
        expect(await token.balanceOf(wallet.address)).to.eq(1000);
      });

      it('Transfer adds amount to destination account', async () => {
        await token.transfer(walletTo.address, 7);
        expect(await token.balanceOf(walletTo.address)).to.eq(7);
      });

      it('Transfer emits event', async () => {
        await expect(token.transfer(walletTo.address, 7))
          .to.emit(token, 'Transfer')
          .withArgs(wallet.address, walletTo.address, 7);
      });

      it('Can not transfer above the amount', async () => {
        await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
      });

      it('Can not transfer from empty account', async () => {
        const tokenFromOtherWallet = token.connect(walletTo);
        await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
          .to.be.reverted;
      });

      it('should use library to add 7', async () => {
        const LibraryConsumerCopy = copy(LibraryConsumer);
        const myLibrary = await deployContract(wallet, MyLibrary, []);
        link(
          LibraryConsumerCopy,
          'test/projects/example/MyLibrary.sol:MyLibrary',
          myLibrary.address
        );
        const libraryConsumer = await deployContract(wallet, LibraryConsumerCopy, []);
        expect(await libraryConsumer.useLibrary(3)).to.eq(10);
      });
    });
  });
});
