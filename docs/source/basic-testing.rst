.. _testing:

Basic testing
=============

Create a mock provider
----------------------

To create a mock provider for running your contracts test against it, e.g.:
::

  provider = createMockProvider();

To modify default provider behavior createMockProvider() takes optional Ganache options parameter. It can be object with specified options or absolute path to waffle.json or another config file, e.g.:
::

  provider = createMockProvider({gasLimit: 0x6691b7, gasPrice: 0x77359400});

  provider = createMockProvider('./waffle.json');

  waffle.json:
    {
      ...
      "ganacheOptions": {
        "gasLimit": "0x6691b7",
        "gasPrice": "0x77359400"
      }
    }

Get example wallets
-------------------

Get wallets you can use to sign transactions:
::

  [wallet, walletTo] = getWallets(provider);

You can get up to ten wallets.

Deploy contract
---------------

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
  link(LibraryConsumer, 'path/to/file/MyLibrary.sol/MyLibrary', myLibrary.address);
  libraryConsumer = await deployContract(wallet, LibraryConsumer, []);

Note: Note: As the second parameter of the link function, you need to use a fully qualified name (full path to file, followed by a colon and the contract name).

