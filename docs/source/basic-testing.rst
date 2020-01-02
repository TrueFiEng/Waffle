.. _testing:

Basic testing
=============

Creating a provider
-------------------

Creating a mock provider for your tests is super simple.

.. code-block:: js

  import { MockProvider } from 'ethereum-waffle';
  const provider = new MockProvider();

This class takes an optional options parameter in the constructor. The options are then passed to the underlying ganache-core implementation. You can read more `about the options here <https://github.com/trufflesuite/ganache-core#options>`__.

.. note::
  Prior to Waffle :code:`2.3.0` provider was created using :code:`createMockProvider(options?)`. It behaved exactly like :code:`new MockProvider` but it returned :code:`providers.Web3Provider`, which is the parent class of :code:`MockProvider`.

Getting wallets
---------------

To obtain wallets that have been prefunded with eth use the provider

.. code-block:: js

  import { MockProvider } from 'ethereum-waffle';

  const provider = new MockProvider();
  const [wallet, otherWallet] = provider.getWallets();

  // or use a shorthand

  const [wallet, otherWallet] = new MockProvider().getWallets();

By default this method returns 10 wallets. You can modify the returned wallets, by changing MockProvider configuration.

.. code-block:: js

  import { MockProvider } from 'ethereum-waffle';
  const provider = new MockProvider({
    accounts: [{balance: 'BALANCE IN WEI', secretKey: 'PRIVATE KEY'}]
  });
  const wallets = provider.getWallets();

You can also get an empty random wallet by calling:

.. code-block:: js

  import { MockProvider } from 'ethereum-waffle';
  const provider = new MockProvider();
  const wallet = provider.createEmptyWallet();

.. note::
  Prior to Waffle :code:`2.3.0` wallets were obtained using :code:`getWallets(provider)`.

Deploying contracts
-------------------

Once you compile your contracts using waffle you can deploy them in your javascript code. It accepts three arguments:
  - wallet to send the deploy transaction
  - contract information (abi and bytecode)
  - contract constructor arguments

Deploy a contract:
::

  import BasicTokenMock from "build/BasicTokenMock.json";

  token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);

The contract information can be one of the following formats:
::

  interface StandardContractJSON {
    abi: any;
    evm: {bytecode: {object: any}};
  }

  interface SimpleContractJSON {
    abi: any[];
    bytecode: string;
  }

Linking
-------

Link a library:
::

  myLibrary = await deployContract(wallet, MyLibrary, []);
  link(LibraryConsumer, 'contracts/MyLibrary.sol:MyLibrary', myLibrary.address);
  libraryConsumer = await deployContract(wallet, LibraryConsumer, []);

Note: Note: As the second parameter of the link function, you need to use a fully qualified name (path to the file relative to the root of the project, followed by a colon and the contract name).

