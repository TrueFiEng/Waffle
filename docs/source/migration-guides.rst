Migration guides
================

Migration from Waffle 2.2.0 to Waffle 2.3.0
-------------------------------------------

Created monorepo
~~~~~~~~~~~~~~~~

Waffle was internally migrated to a monorepo. Thanks to this, you can now use parts of waffle individually. We provide the following packages:

- :code:`ethereum-waffle` - core package exporting everything
- :code:`ethereum-compiler` - compile your contracts programmatically
- :code:`ethereum-chai` - chai matchers for better unit testing
- :code:`ethereum-provider` - mock provider to interact with an in-memory blockchain

Created MockProvider class
~~~~~~~~~~~~~~~~~~~~~~~~~~

We added MockProvider class. It changed the creation of the provider.

*Waffle 2.2.0*

.. code-block:: ts

  await createMockProvider(options);

*Waffle 2.3.0*

.. code-block:: ts

  provider = new MockProvider();

Reorganise getWallets() method
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*Waffle 2.2.0*

.. code-block:: ts

  await getWallets(provider);

*Waffle 2.3.0*

.. code-block:: ts

  new MockProvider().getWallets()

Migration from Waffle 2.3.0 to Waffle 2.4.0
-------------------------------------------

Renamed configuration options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We renamed configuration options to compile contracts:

- :code:`sourcesPath` - renamed to :ref:`sourceDirectory`
- :code:`targetPath` - renamed to :ref:`outputDirectory`
- :code:`npmPath` - renamed to :ref:`nodeModulesDirectory`
- :code:`compiler` - renamed to :ref:`compilerType`
- :code:`docker-tag` - replaced by :ref:`compilerVersion`
- :code:`solcVersion` - replaced by :ref:`compilerVersion`
- :code:`legacyOutput` - removed, setting it to false gave no effect
- :code:`allowedPaths` - renamed to :ref:`compilerAllowedPaths`
- :code:`ganacheOptions` - removed, wasn't used by the compiler

Migration from Waffle 2.5.* to Waffle 3.0.0
-------------------------------------------

There are some new functionality and some slight refactoring and improved paradigms in Waffle v3.

Removed deprecated APIs from the provider
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In :code:`Waffle 3.0.0` we remove deprecated APIs from the provider, such as :code:`createMockProvider` and :code:`getGanacheOptions`.

Swapped arguments for Fixture
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In :code:`Waffle 3.0.0` we swapped arguments for Fixture, because the provider argument is very rarely used compared to wallets.
So such implementation should be more convenient for users.

*Waffle 2.5.0*

.. code-block:: ts

  function createFixtureLoader(overrideProvider?: MockProvider, overrideWallets?: Wallet[]);

*Waffle 3.0.0*

.. code-block:: ts

  function createFixtureLoader(overrideWallets?: Wallet[], overrideProvider?: MockProvider);

*Waffle 2.5.0*

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
  });

*Waffle 3.0.0*

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
  });

Added automatic recognising waffle.json config without cli argument
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Waffle recognises :code:`waffle.json` as the default configuration file. If your configuration file is called
:code:`waffle.json`, it's possible to use just :code:`waffle` to build contracts.

In Waffle 2.5.0, If the argument has not been provided, the Waffle uses the default configuration.

*Waffle 2.5.0*

.. code-block:: json

  {
    "scripts": {
      "build": "waffle waffle.json"
    }
  }

*Waffle 3.0.0*

.. code-block:: json

  {
    "scripts": {
      "build": "waffle"
    }
  }

Introduced MockProviderOptions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We added MockProviderOptions. It will be convenient in the future, when the provider may need some
options other than :code:`ganacheOptions`.

*Waffle 2.5.0*

.. code-block:: ts

  import {expect} from 'chai';
  import {Wallet} from 'ethers';
  import {MockProvider} from 'ethereum-waffle';
  import {deployToken} from './BasicToken';

  describe('INTEGRATION: MockProvider', () => {
    it('accepts options', () => {
      const original = Wallet.createRandom();
      const provider = new MockProvider({
          accounts: [{balance: '100', secretKey: original.privateKey}]
      });
      const wallets = provider.getWallets();
      expect(wallets.length).to.equal(1);
      expect(wallets[0].address).to.equal(original.address);
    });
  });

*Waffle 3.0.0*

.. code-block:: ts

  import {expect} from 'chai';
  import {Wallet} from 'ethers';
  import {MockProvider} from 'ethereum-waffle';
  import {deployToken} from './BasicToken';

  describe('INTEGRATION: MockProvider', () => {
    it('accepts options', () => {
      const original = Wallet.createRandom();
      const provider = new MockProvider({
        ganacheOptions: {
          accounts: [{balance: '100', secretKey: original.privateKey}]
        }
      });
      const wallets = provider.getWallets();
      expect(wallets.length).to.equal(1);
      expect(wallets[0].address).to.equal(original.address);
    });
  });

Dropped support for contract interface
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We dropped support for contract interface because it duplicated contract ABI. Also :code:`interface` is a keyword in typescript,
so we decided not to use this field. Now we support just :code:`contract.abi`.

*Waffle 2.5.0*

.. code-block:: text

  {
    "abi": [
      ...
    ],
    "interface: [
      ...
    ],
    "evm": {
      ...
    },
    "bytecode": "..."
  }

*Waffle 3.0.0*

.. code-block:: text

  {
    "abi": [
      {...}
    ],
    "evm": {
      ...
    },
    "bytecode": "..."
  }


Migration from Waffle 3.* to Waffle 4.0.0-alpha
-----------------------------------------------

The main difference between Waffle 3.* and Waffle 4.0.0-alpha is about dependencies that Waffle packages use. 
We updated the following dependencies:

- :code:`typechain` - bumped version from ^2.0.0 to ^9.0.0. Now every Waffle package uses the same version of the package. Also the package was moved to the :code:`peerDependencies` section - you now need to install  :code:`typechain` manually when using Waffle.
- :code:`ethers` - bumped version from to ^5.5.4. Now every Waffle package uses the same version of the package. Also the package was moved to the :code:`peerDependencies` section - you now need to install :code:`ethers`` manually when using Waffle.
- :code:`solc` - the package is used by :code:`waffle-compiler` package to provide the default option for compiling Soldity code. Was moved to the :code:`peerDependencies` section and has no version restrictions - you now have to install :code:`solc` manually when using Waffle.

If you used type generation (:code:`typechainEnabled` option set to :code:`true` in :code:`waffle.json`), you need to update your code to conform to the new naming convention used by :code:`typechain`. Contract factories now have postfix :code:`__factory` instead of :code:`Factory`. For example, :code:`MyContractFactory` becomes :code:`MyContract__factory`. Example refactoring:

.. code-block:: diff

  const contractConstructorArgs: [string, string] = [bob.address, charlie.address];
  -const contract = await deployContract(alice, MyContractFactory, contractConstructorArgs);
  +const contract = await deployContract(alice, MyContract__factory, contractConstructorArgs);
