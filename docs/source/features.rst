Features
========

Basic features
------------------------

Import contracts from npms
^^^^^^^^^^^^^^^^^^^^^^^^^^

Import solidity files from solidity files form npm modules that you added to your project, e.g
::

  import "openzeppelin-solidity/contracts/math/SafeMath.sol";


Create a mock provider
^^^^^^^^^^^^^^^^^^^^^^

Create a mock provider (no need to run any tests!) and test your contracts against it, e.g.:
::

  provider = createMockProvider();


Get example wallets
^^^^^^^^^^^^^^^^^^^

Get wallets you can use to sign transactions:
::

  [wallet, walletTo] = await getWallets(provider);


Deploy contract
^^^^^^^^^^^^^^^

Deploy a contract:
::

  token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);


Link a library:
::

  myLibrary = await deployContract(wallet, MyLibrary, []);
  link(LibraryConsumer, 'path/to/file:MyLibrary.sol:MyLibrary', myLibrary.address);
  libraryConsumer = await deployContract(wallet, LibraryConsumer, []);


Chai matchers
-------------
A set of sweet chai matchers, makes your test easy to write and read. Below couple of examples.

- Testing big numbers:
  ::

    expect(await token.balanceOf(wallet.address)).to.eq(993);

Available matchers for BigNumbers are: `equal`, `eq`, `above`, `below`, `least`, `most`.

- Testing what events where emitted with what arguments:
  ::

    await expect(token.transfer(walletTo.address, 7))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 7);


- Testing if transaction was reverted:
  ::

    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;


- Testing if transaction was reverted with certain message:
  ::

    await expect(token.transfer(walletTo.address, 1007)).to.be.revertedWith('Insufficient funds');



- Testing if string is a proper address:
  ::

    expect('0x28FAA621c3348823D6c6548981a19716bcDc740e').to.be.properAddress;


- Testing if string is a proper secret:
  ::

    expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5').to.be.properPrivateKey;


- Testing if string is a proper hex value of given length:
  ::

    expect('0x70').to.be.properHex(2);


- Testing whether the transaction changes balance
  ::

    await expect(() => myContract.transferWei(receiverWallet.address, 2)).to.changeBalance(receiverWallet, 2);


  **Note:** transaction call should be passed to the _expect_ as a callback (we need to check the balance before the call).
  The matcher can accept numbers, strings and BigNumbers as a balance change, while the address should be specified as a wallet.

  _changeBalance_ calls should not be chained. If you need to chain it, you probably want to use _changeBalances_ matcher.

- Testing whether the transaction changes balance for multiple accounts
  ::

    await expect(() => myContract.transferWei(receiverWallet.address, 2)).to.changeBalances([senderWallet, receiverWallet], [-2, 2]);


Fixtures
--------

When testing code dependent on smart contracts it is often useful to have a specific scenario play out before every test. For example when testing an ERC20 token one might want to check that specific addresses can or cannot perform transfers. Before each of those tests however you have to deploy the ERC20 contract and maybe transfer some funds.

The repeated deployment of contracts might slow down the test significantly. This is why Waffle allows you to create fixtures - testing scenarios that are executed once and then remembered by making snaphots of the blockchain. This significantly speeds up the tests.

Example:
::

  import {expect} from 'chai';
  import {loadFixture, deployContract} from 'ethereum-waffle';
  import BasicTokenMock from './build/BasicTokenMock';

  describe('Fixtures', () => {
    async function fixture(provider, [wallet, other]) {
      const token = await deployContract(wallet, BasicTokenMock, [
        wallet.address, 1000
      ]);
      return {token, wallet, other};
    }

    it('Assigns initial balance', async () => {
      const {token, wallet} = await loadFixture(fixture);
      expect(await token.balanceOf(wallet.address)).to.eq(1000);
    });

    it('Transfer adds amount to destination account', async () => {
      const {token, other} = await loadFixture(fixture);
      await token.transfer(other.address, 7);
      expect(await token.balanceOf(other.address)).to.eq(7);
    });
  });


Fixtures receive a provider and an array of wallets as an argument. By default the provider is obtained by calling `createMockProvider` and the wallets by `getWallets`. You can however override those by using a custom fixture loader.

::

  import {createFixtureLoader} from 'ethereum-waffle';

  const loadFixture = createFixtureLoader(myProvider, myWallets);

  // later in tests
  await loadFixture((myProvider, myWallets) => {
    // fixture implementation
  });

