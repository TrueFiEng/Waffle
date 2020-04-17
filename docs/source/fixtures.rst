Fixtures
========

When testing code dependent on smart contracts it is often useful to have a specific scenario play out before every test. For example, when testing an ERC20 token one might want to check that specific addresses can or cannot perform transfers. Before each of those tests however, you have to deploy the ERC20 contract and maybe transfer some funds.

The repeated deployment of contracts might slow down the test significantly. This is why Waffle allows you to create fixtures - testing scenarios that are executed once and then remembered by making snapshots of the blockchain. This significantly speeds up the tests.

Example:

.. code-block:: js

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
      expect(await token.balanceOf(wallet.address)).to.equal(1000);
    });

    it('Transfer adds amount to destination account', async () => {
      const {token, other} = await loadFixture(fixture);
      await token.transfer(other.address, 7);
      expect(await token.balanceOf(other.address)).to.equal(7);
    });
  });


Fixtures receive a provider and an array of wallets as an argument. By default, the provider is obtained by calling `createMockProvider` and the wallets by `getWallets`. You can, however, override those by using a custom fixture loader.

.. code-block:: js

  import {createFixtureLoader} from 'ethereum-waffle';

  const loadFixture = createFixtureLoader(myProvider, myWallets);

  // later in tests
  await loadFixture((myProvider, myWallets) => {
    // fixture implementation
  });

Experimental version with using dockerized vyper for compilation.
---------------------------
Warring! This is experimental and the api might change without major version change.

This is the recommended option if you have contracts in Vyper. It is pretty easy to set up, especially if you have Docker
installed.

If you don't have docker visit the `Docker documentation <https://www.docker.com/get-started>`__
to learn how to install it.

After you've installed docker you can install the Vyper compiler. Pull the
docker container tagged with the version you are interested in, for example for
version 0.1.0:
::

  docker pull vyperlang/vyper:0.1.0

Then, change the :code:`compilerType` setting in your :code:`.waffle.json` file:

.. code-block:: json

  {
    "compilerType": "dockerized-vyper",
    "compilerVersion": "0.1.0"
  }

If no :code:`compilerVersion` is specified the docker tag pulled defaults to
:code:`latest`. To read more about configuring Waffle, see :ref:`configuration`.

When compiling your smart contracts Waffle will now use the docker image you
pulled.

