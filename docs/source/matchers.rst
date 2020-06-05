Chai matchers
=============

A set of sweet chai matchers, makes your test easy to write and read. Before you can start using the matchers, you have to tell chai to use the solidity plugin:

.. code-block:: ts

  import chai from "chai";
  import { solidity } from "ethereum-waffle";
  
  chai.use(solidity);

Below is the list of available matchers:

Bignumbers
----------
Testing equality of big numbers:

.. code-block:: ts

  expect(await token.balanceOf(wallet.address)).to.equal(993);

Available matchers for BigNumbers are: `equal`, `eq`, `above`, `below`, `least`, `most`.

Emitting events
---------------

Testing what events were emitted with what arguments:

.. code-block:: ts

  await expect(token.transfer(walletTo.address, 7))
    .to.emit(token, 'Transfer')
    .withArgs(wallet.address, walletTo.address, 7);

Called on contract
------------------

Testing if function was called on provided contract:

.. code-block:: ts

  await token.balanceOf(wallet.address)

  expect('balanceOf').to.be.calledOnContract(token);

Called on contract with arguments
---------------------------------

Testing if function with certain arguments was called on provided contract:

.. code-block:: ts

  await token.balanceOf(wallet.address)

  expect('balanceOf').to.be.calledOnContractWith(token, [wallet.address]);

Revert
------
Testing if transaction was reverted:

.. code-block:: ts

  await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;


Revert with message
-------------------

Testing if transaction was reverted with certain message:

.. code-block:: ts

  await expect(token.transfer(walletTo.address, 1007))
    .to.be.revertedWith('Insufficient funds');


Change balance
--------------
Testing whether the transaction changes balance of an account

.. code-block:: ts

  await expect(() => wallet.sendTransaction({to: walletTo.address, gasPrice: 0, value: 200}))
    .to.changeBalance(walletTo, 200);


.. note:: Transaction call should be passed to the :code:`expect` as a callback (we need to check the balance before the call).
The matcher can accept numbers, strings and BigNumbers as a balance change, while the address should be specified as a wallet.

.. note:: :code:`changeBalance` calls should not be chained. If you need to chain it, you probably want to use :code:`changeBalances` matcher.

Change balance (multiple accounts)
----------------------------------

Testing whether the transaction changes balance for multiple accounts:

.. code-block:: ts

  await expect(() => wallet.sendTransaction({to: walletTo.address, gasPrice: 0, value: 200}))
    .to.changeBalances([walletFrom, walletTo], [-200, 200]);


Proper address
------------------
Testing if string is a proper address:

.. code-block:: ts

  expect('0x28FAA621c3348823D6c6548981a19716bcDc740e').to.be.properAddress;


Proper private key
------------------
Testing if string is a proper secret:

.. code-block:: ts

  expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5').to.be.properPrivateKey;

Proper hex
----------
Testing if string is a proper hex value of given length:

.. code-block:: ts

  expect('0x70').to.be.properHex(2);

