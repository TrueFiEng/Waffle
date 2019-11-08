Getting Started
===============

Installation
------------

To get started install :code:`ethereum-waffle` with yarn:
::

  yarn add --dev ethereum-waffle

Or if you prefer using npm:
::

  npm install --save-dev ethereum-waffle

Writing a contract
------------------

Below is example contract written in Solidity. Save it as :code:`Counter.sol`
inside the :code:`contracts` directory of your project.
::

  pragma solidity ^0.5.0;

  contract Counter {
    event Increment (uint256 by);

    uint256 public value;

    constructor (uint256 initialValue) public {
      value = initialValue;
    }

    function increment (uint256 by) public {
      // NOTE: You should use SafeMath in production code
      value += by;
      emit Increment(by);
    }
  }

Compiling the contract
----------------------

In the :code:`package.json` file of your project add the following entry:

.. code-block:: json

  {
    "scripts": {
      "build": "waffle"
    }
  }

Then run the following command:::

  yarn build

Or if you prefer npm:
::

  npm run build

You should see that Waffle compiled your contract and placed the resulting JSON
output inside the :code:`build` directory.

If you want to know more about how to configure Waffle, see :ref:`configuration`.

Writing tests
-------------

After you have successfully authored a Smart Contract you can now think about
testing it. Fortunately for you Waffle is packed with tools that help with that.

Tests in waffle are written using `Mocha <https://mochajs.org/>`__ alongide with
`Chai <https://www.chaijs.com/>`__. You can use a different test environment,
but Waffle matchers only work with :code:`chai`.

Run:
::

  yarn add --dev mocha chai

Or:
::

  npm install --save-dev mocha chai

Belows is an example test file for the contract above written with Waffle. You
can save the file as :code:`Counter.test.js` in the :code:`test` directory of
your project.

.. code-block:: javascript

  const {use, expect} = require('chai');
  const {solidity, createMockProvider, getWallets, deployContract} = require('ethereum-waffle');
  const Counter = require('../build/Counter.json');

  use(solidity);

  describe('Counter smart contract', () => {
    const provider = createMockProvider();
    const [wallet] = getWallets(provider);

    async function deployCounter (initialValue) {
      const counter = await deployContract(
        wallet, // a wallet to sign transactions
        Counter, // the compiled output
        [initialValue], // arguments to the smart contract constructor
      );
      return counter; // an ethers 'Contract' class instance
    }

    it('sets initial value in the constructor', async () => {
      const counter = await deployCounter(200);
      expect(await counter.value()).to.equal(200);
    });

    it('can increment the value', async () => {
      const counter = await deployCounter(200);
      await counter.increment(42);
      expect(await counter.value()).to.equal(242);
    });

    it('emits the Increment event', async () => {
      const counter = await deployCounter(200);
      await expect(counter.increment(42))
        .to.emit(counter, 'Increment')
        .withArgs(42);
    });
  });


Running tests
-------------

Update your :code:`package.json` file to include:

.. code-block:: json

  {
    "scripts": {
      "build": "waffle",
      "test": "mocha"
    }
  }

And run:
::

  yarn test

Or:
::

  npm test

You should see the following output:
::

  Counter smart contract
    ✓ sets initial value in the constructor (140ms)
    ✓ can increment the value (142ms)
    ✓ emits the Increment event (114ms)

  3 passing (426ms)

If you want to know more about testing with Waffle, see :ref:`testing`.
