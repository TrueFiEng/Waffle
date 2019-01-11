Getting Started
===============

Installation
------------

To start using with npm, type:
::

  npm i ethereum-waffle

or with Yarn:
::

  yarn add ethereum-waffle


Example contract
----------------

Below is example contract written in Solidity. Place it in `contracts` directory of your project:

::

  pragma solidity ^0.5.1;

  import "../BasicToken.sol";

  contract BasicTokenMock is BasicToken {

    constructor(address initialAccount, uint256 initialBalance) public {
      balances[initialAccount] = initialBalance;
      totalSupply_ = initialBalance;
    }

  }


Example test
------------
Belows is example test written for the contract above written with Waffle. Place it in `test` directory of your project:

::

  import chai from 'chai';
  import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
  import BasicTokenMock from './build/BasicTokenMock';

  chai.use(solidity);

  const {expect} = chai;

  describe('Example', () => {
    let provider;
    let token;
    let wallet;
    let walletTo;

    beforeEach(async () => {
      provider = createMockProvider();
      [wallet, walletTo] = await getWallets(provider);
      token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);
    });

    it('Assigns initial balance', async () => {
      expect(await token.balanceOf(wallet.address)).to.eq(1000);
    });

    it('Transfer adds amount to destination account', async () => {
      await token.transfer(walletTo.address, 7);
      expect(await token.balanceOf(wallet.address)).to.eq(993);
      expect(await token.balanceOf(walletTo.address)).to.eq(7);
    });

    it('Transfer emits event', async () => {
      await expect(token.transfer(walletTo.address, 7))
        .to.emit(token, 'Transfer')
        .withArgs(wallet.address, walletTo.address, 7);
    });

    it('Can not transfer from empty account', async () => {
      const tokenFromOtherWallet = contractWithWallet(token, walletTo);
      await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
        .to.be.revertedWith('Not enough balance on sender account');
    });
  });


Compilation
-----------
To compile contracts simply type:
::

  npx waffle


To compile using custom configuration file:
::

  npx waffle config.json


Example configuration file looks like this:
::

  {
    "sourcesPath": "./custom_contracts",
    "targetPath": "./custom_build",
    "npmPath": "./custom_node_modules"
  }


Run tests
---------

To run test type in the console:
::

  mocha


Adding a task
^^^^^^^^^^^^^

For convince, you can add a task to your `package.json`. In the sections `scripts`, add following line:
::

  "test": "waffle && test"


Now you can build and test your contracts with one command:
::

  npm test


