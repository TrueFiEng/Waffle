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


Migration from Waffle 3.4.0 to Waffle 4.0.0-alpha
-------------------------------------------------

Dependencies upgrades
~~~~~~~~~~~~~~~~~~~~~

The main difference between Waffle 3.4.0 and Waffle 4.0.0-alpha is about dependencies that Waffle packages use. 
We updated the following dependencies:

- :code:`typechain` - bumped version from ^2.0.0 to ^9.0.0. Now every Waffle package uses the same version of the package. Also the package was moved to the :code:`peerDependencies` section - you now need to install  :code:`typechain` manually when using Waffle.
- :code:`ethers` - bumped version from to ^5.5.4. Now every Waffle package uses the same version of the package. Also the package was moved to the :code:`peerDependencies` section - you now need to install :code:`ethers` manually when using Waffle.
- :code:`solc` - the package is used by :code:`waffle-compiler` package to provide the default option for compiling Soldity code. Was moved to the :code:`peerDependencies` section and has no version restrictions - you now have to install :code:`solc` manually when using Waffle.
- Deprecated :code:`ganache-core` package has been replaced with :code:`ganache` version ^7.0.3. It causes slight differences in the parameters of :code:`MockProvider` from :code:`@ethereum-waffle/provider`. Now the :code:`MockProvider` uses :code:`berlin` hardfork by default.

Changes to :code:`MockProvider` parameters
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Previous (optional) parameters of :code:`MockProvider` included override options for the Ganache provider:

.. code-block:: ts

  interface MockProviderOptions {
    ganacheOptions: {
      account_keys_path?: string;
      accounts?: object[];
      allowUnlimitedContractSize?: boolean;
      blockTime?: number;
      db_path?: string;
      debug?: boolean;
      default_balance_ether?: number;
      fork?: string | object;
      fork_block_number?: string | number;
      forkCacheSize?: number;
      gasLimit?: string | number;
      gasPrice?: string;
      hardfork?: "byzantium" | "constantinople" | "petersburg" | "istanbul" | "muirGlacier";
      hd_path?: string;
      locked?: boolean;
      logger?: {
        log(msg: string): void;
      };
      mnemonic?: string;
      network_id?: number;
      networkId?: number;
      port?: number;
      seed?: any;
      time?: Date;
      total_accounts?: number;
      unlocked_accounts?: string[];
      verbose?: boolean;
      vmErrorsOnRPCResponse?: boolean;
      ws?: boolean;
    }
  }

Current :code:`ganacheOptions` parameter are documented `here <https://github.com/trufflesuite/ganache/blob/386771d84a9985f6d4b61b262f2be3cda896162e/src/chains/ethereum/options/src/index.ts#L22-L29>`_.

Typechain changes
~~~~~~~~~~~~~~~~~

If you used type generation (:code:`typechainEnabled` option set to :code:`true` in :code:`waffle.json`), you need to update your code to conform to the new naming convention used by :code:`typechain`. Contract factories now have postfix :code:`__factory` instead of :code:`Factory`. For example, :code:`MyContractFactory` becomes :code:`MyContract__factory`. Example refactoring:

.. code-block:: diff

  const contractConstructorArgs: [string, string] = [bob.address, charlie.address];
  -const contract = await deployContract(alice, MyContractFactory, contractConstructorArgs);
  +const contract = await deployContract(alice, MyContract__factory, contractConstructorArgs);

:code:`@ethereum-waffle/jest` deprecated
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We stopped supporting :code:`@ethereum-waffle/jest`. From now on the package is deprecated and will be removed in the future. The suggested test framework to use with :code:`Waffle` is :code:`mocha` combined with :code:`chai` and :code:`@ethereum-waffle/chai` package. If you want to migrate from `jest` to `mocha` in your project, please follow the guide below.

1. Setup :code:`mocha` - this may include the following steps:

  - installing :code:`mocha` and :code:`chai` packages.
  - if you are using :code:`typescript`, installing :code:`@types/mocha`, :code:`@types/chai` and :code:`ts-node` packages.
  - updating your :code:`test` script (the common pattern for typescript is :code:`"test": "mocha -r ts-node/register/transpile-only 'test/**/*.test.ts'"`).
  - updating your tests to use :code:`mocha` syntax.

2.  Replace :code:`@ethereum-waffle/jest` with :code:`@ethereum-waffle/chai`. Below is little table that contains the list of all the matchers provided by :code:`@ethereum-waffle/jest` and their replacements in :code:`@ethereum-waffle/chai`.

.. list-table:: Matchers replacements
   :widths: 50 50
   :header-rows: 1

   * - @ethereum-waffle/jest
     - @ethereum-waffle/chai
   * - :code:`.toChangeBalance(wallet, balanceChange)`
     - :code:`.to.changeEtherBalance(wallet, balanceChange)`
   * - :code:`.toChangeBalances(wallets, balanceChanges)`
     - :code:`.to.changeEtherBalances(wallets, balanceChanges)`
   * - :code:`.toBeGtBN(value)`
     - :code:`.to.be.gt(value)`
   * - :code:`.toBeLtBN(value)`
     - :code:`.to.be.lt(value)`
   * - :code:`.toBeGteBN(value)`
     - :code:`.to.be.gte(value)`
   * - :code:`.toBeLteBN(value)`
     - :code:`.to.be.lte(value)`
   * - :code:`.toEqBN(value)`
     - :code:`.to.equal(value)`
   * - :code:`.toHaveEmitted(contract, eventName)`
     - :code:`.to.emit(contract, eventName)`
   * - :code:`.toHaveEmittedWith(contract, eventName, args)`
     - :code:`.to.emit(contract, eventName).withArgs(...args)`
   * - :code:`.toThrowErrorMatchingSnapshot()`
     - :code:`.to.be.eventually.rejectedWith(expected, message)`
   * - :code:`.toBeProperPrivateKey()`
     - :code:`.to.be.properPrivateKey`
   * - :code:`.toBeProperAddress()`
     - :code:`.to.be.properAddress`
   * - :code:`.toBeReverted()`
     - :code:`.to.be.reverted`
   * - :code:`.toBeRevertedWith(revertReason)`
     - :code:`.to.be.revertedWith(reason)`

Time-based tests
~~~~~~~~~~~~~~~~

If your tests rely on manually setting timestamp on the blockchain using `evm_mine`, you need to use `evm_setTime` alongside.

For example:

.. code-block:: diff

  export async function mineBlock(provider: providers.Web3Provider, timestamp: number) {
    +provider.send('evm_setTime', [timestamp * 1000])
    await provider.send('evm_mine', [timestamp])
  }

Tests relying on setting gasPrice
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Since `London hardfork <https://eips.ethereum.org/EIPS/eip-1559>`_, :code:`baseFeePerGas` is replacing :code:`gasPrice`.
If your tests are relying on setting :code:`gasPrice` with :code:`changeBalance` matcher, you will have to update them.

**Before**

.. code-block:: javascript

  await expect(() =>
    sender.sendTransaction({
      to: receiver.address,
      gasPrice: 0,
      value: 200
    })
  ).to.changeBalance(sender, -200);

**After**

.. code-block:: javascript

  const TX_GAS = 21000;
  const BASE_FEE_PER_GAS = 875000000
  const gasFees = BASE_FEE_PER_GAS * TX_GAS;
  await expect(() =>
    sender.sendTransaction({
      to: receiver.address,
      gasPrice: BASE_FEE_PER_GAS,
      value: 200
    })
  ).to.changeBalance(sender, -(gasFees + 200));

Currently there is no way to set :code:`gasPrice` to :code:`0` in :code:`Ganache`.
Instead of (deprecated) matcher :code:`changeBalance`, new matcher :code:`changeEtherBalance` can be used instead - which handles transaction fee calculation automatically.
