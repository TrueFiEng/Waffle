Fixtures
========

When testing code dependent on smart contracts it is often useful to have a specific scenario play out before every test. For example, when testing an ERC20 token one might want to check that specific addresses can or cannot perform transfers. Before each of those tests however, you have to deploy the ERC20 contract and maybe transfer some funds.

The repeated deployment of contracts might slow down the test significantly. This is why Waffle allows you to create fixtures - testing scenarios that are executed once and then remembered by making snapshots of the blockchain. This significantly speeds up the tests.

Example:

.. tabs::

  .. group-tab:: Waffle 3.0.0

    .. code-block:: ts

      import {expect} from 'chai';
      import {loadFixture, deployContract} from 'ethereum-waffle';
      import BasicTokenMock from './build/BasicTokenMock';

      describe('Fixtures', () => {
        async function fixture([wallet, other], provider) {
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

  .. group-tab:: Waffle 2.5.0

    .. code-block:: ts

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


Fixtures receive a provider and an array of wallets as an argument. By default, the wallets are obtained by calling :code:`getWallets` and the provider by :code:`createMockProvider`. You can, however, override those by using a custom fixture loader.

.. tabs::

  .. group-tab:: Waffle 3.0.0

    .. code-block:: ts

      import {createFixtureLoader} from 'ethereum-waffle';

      const loadFixture = createFixtureLoader(myWallets, myProvider);

      // later in tests
      await loadFixture((myWallets, myProvider) => {
        // fixture implementation
      });

  .. group-tab:: Waffle 2.5.0

    .. code-block:: ts

      import {createFixtureLoader} from 'ethereum-waffle';

      const loadFixture = createFixtureLoader(myProvider, myWallets);

      // later in tests
      await loadFixture((myProvider, myWallets) => {
        // fixture implementation
      });
