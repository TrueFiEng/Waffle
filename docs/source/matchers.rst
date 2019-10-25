Chai matchers
=============

A set of sweet chai matchers, makes your test easy to write and read. Below is the list of available matchers:

Bignumbers
----------
Testing equality of big numbers:

::

  expect(await token.balanceOf(wallet.address)).to.eq(993);

Available matchers for BigNumbers are: `equal`, `eq`, `above`, `below`, `least`, `most`.

Emitting events
---------------

Testing what events were emitted with what arguments:
::

  await expect(token.transfer(walletTo.address, 7))
    .to.emit(token, 'Transfer')
    .withArgs(wallet.address, walletTo.address, 7);


Revert
------
Testing if transaction was reverted:

::

  await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;


Revert with message
-------------------

Testing if transaction was reverted with certain message:
::

  await expect(token.transfer(walletTo.address, 1007))
    .to.be.revertedWith('Insufficient funds');


Change balance
--------------
Testing whether the transaction changes balance of an account
::

  await expect(() => myContract.transferWei(receiverWallet.address, 2))
    .to.changeBalance(receiverWallet, 2);


**Note:** transaction call should be passed to the ``expect`` as a callback (we need to check the balance before the call).
The matcher can accept numbers, strings and BigNumbers as a balance change, while the address should be specified as a wallet.

**Note:** ``changeBalance`` calls should not be chained. If you need to chain it, you probably want to use ``changeBalances`` matcher.

Change balance (multiple accounts)
----------------------------------

Testing whether the transaction changes balance for multiple accounts:
::

  await expect(() => myContract.transferWei(receiverWallet.address, 2))
    .to.changeBalances([senderWallet, receiverWallet], [-2, 2]);


Proper address
------------------
Testing if string is a proper address:

::

  expect('0x28FAA621c3348823D6c6548981a19716bcDc740e').to.be.properAddress;


Proper private key
------------------
Testing if string is a proper secret:

::

  expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5').to.be.properPrivateKey;

Proper hex
----------
Testing if string is a proper hex value of given length:
  ::

    expect('0x70').to.be.properHex(2);

