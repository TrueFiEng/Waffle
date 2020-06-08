Getting Started
===============

Installation
------------

To get started install :code:`ethereum-waffle`:

.. tabs::

  .. group-tab:: Yarn

    .. code-block:: text

      yarn add --dev ethereum-waffle

  .. group-tab:: NPM

    .. code-block:: text

      npm install --save-dev ethereum-waffle

Add external dependency
-----------------------

To add an external library install it using npm:

.. tabs::

  .. group-tab:: Yarn

    .. code-block:: text

      yarn add @openzeppelin/contracts -D

  .. group-tab:: NPM

    .. code-block:: text

      npm install @openzeppelin/contracts -D

Writing a contract
------------------

Below is example contract written in Solidity. Place it in :code:`contracts/BasicToken.sol` file of your project:

.. code-block:: solidity

  pragma solidity ^0.6.0;

  import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

  // Example class - a mock class using delivering from ERC20
  contract BasicToken is ERC20 {
    constructor(uint256 initialBalance) ERC20("Basic", "BSC") public {
        _mint(msg.sender, initialBalance);
    }
  }

Compiling the contract
----------------------

In the :code:`package.json` file of your project add the following entry:

.. code-block:: json

  {
    "scripts": {
      "build": "waffle waffle.json",
    }
  }

.. note::

  Waffle recognises :code:`waffle.json` as default configuration file. If your configuration file is called
  :code:`waffle.json`, it's possible to use just :code:`waffle` to build contracts.

In the :code:`waffle.json` file of your project add the following entry:

.. code-block:: json

  {
    "compilerType": "solcjs",
    "compilerVersion": "0.6.2",
    "sourceDirectory": "./src",
    "outputDirectory": "./build"
  }

Then run the following command:

.. tabs::

  .. group-tab:: Yarn

    .. code-block:: text

      yarn build

  .. group-tab:: NPM

    .. code-block:: text

      npm run build

You should see that Waffle compiled your contract and placed the resulting JSON
output inside the :code:`build` directory.

If you want to know more about how to configure Waffle, see :ref:`configuration`.

Flattener
---------

To flat your smart contracts run:
::

  npx waffle flatten

In configuration file you can add optional field with path to flatten files:

.. code-block:: json

  {
    "flattenOutputDirectory": "./custom_flatten"
  }


Writing tests
-------------

After you have successfully authored a Smart Contract you can now think about
testing it. Fortunately for you Waffle is packed with tools that help with that.

Tests in waffle are written using `Mocha <https://mochajs.org/>`__ alongide with
`Chai <https://www.chaijs.com/>`__. You can use a different test environment,
but Waffle matchers only work with :code:`chai`.

Run:

.. tabs::

  .. group-tab:: Yarn

    .. code-block:: text

      yarn add --dev mocha chai

  .. group-tab:: NPM

    .. code-block:: text

      npm install --save-dev mocha chai

Belows is an example test file for the contract above written with Waffle. Place it under :code:`test/BasicToken.test.ts` file in your project directory:

.. code-block:: ts

  import {expect, use} from 'chai';
  import {Contract} from 'ethers';
  import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
  import BasicToken from '../build/BasicToken.json';

  use(solidity);

  describe('BasicToken', () => {
    const [wallet, walletTo] = new MockProvider().getWallets();
    let token: Contract;

    beforeEach(async () => {
      token = await deployContract(wallet, BasicToken, [1000]);
    });

    it('Assigns initial balance', async () => {
      expect(await token.balanceOf(wallet.address)).to.equal(1000);
    });

    it('Transfer adds amount to destination account', async () => {
      await token.transfer(walletTo.address, 7);
      expect(await token.balanceOf(walletTo.address)).to.equal(7);
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

    it('Calls totalSupply on BasicToken contract', async () => {
      await token.totalSupply();
      expect('totalSupply').to.be.calledOnContract(token);
    });

    it('Calls balanceOf with sender address on BasicToken contract', async () => {
      await token.balanceOf(wallet.address);
      expect('balanceOf').to.be.calledOnContractWith(token, [wallet.address]);
    });
  });


Running tests
-------------

Update your :code:`package.json` file to include:

.. code-block:: json

  {
    "scripts": {
      "build": "waffle",
      "test": "export NODE_ENV=test && mocha",
    }
  }

And run:

.. tabs::

  .. group-tab:: Yarn

    .. code-block:: text

      yarn test

  .. group-tab:: NPM

    .. code-block:: text

      npm test

You should see the following output:

.. code-block:: text

  BasicToken
    ✓ Assigns initial balance (67ms)
    ✓ Transfer adds amount to destination account (524ms)
    ✓ Transfer emits event (309ms)
    ✓ Can not transfer above the amount (44ms)
    ✓ Can not transfer from empty account (78ms)
    ✓ Calls totalSupply on BasicToken contract (43ms)
    ✓ Calls balanceOf with sender address on BasicToken contract (45ms)


  7 passing (5s)

If you want to know more about testing with Waffle, see :ref:`testing`.
