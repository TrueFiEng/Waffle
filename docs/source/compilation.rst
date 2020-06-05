Compilation
===========

.. _third-party:

Using third party libraries
---------------------------

One of the nice things about Waffle is that it enables you to import third party
libraries when writing your smart contracts. All you need to do is install the
library from :code:`npm`.

For example you can install the popular :code:`@openzeppelin/contracts` package:

.. tabs::

  .. group-tab:: Yarn

    .. code-block:: text

      yarn add @openzeppelin/contracts

  .. group-tab:: NPM

    .. code-block:: text

      npm install @openzeppelin/contracts

After installing a library you can import it in your Solidity code:

.. code-block:: solidity

  pragma solidity ^0.6.0;

  import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

If you are using a custom :code:`node_modules` location you can configure Waffle
to recognize it. Change the :code:`nodeModulesDirectory` setting in your :code:`.waffle.json` file:

.. code-block:: json

  {
    "nodeModulesDirectory": "path/to/node_modules"
  }

To read more about configuring Waffle, see :ref:`configuration`.

.. _compile-times:

Reducing compile times
----------------------

By default, Waffle uses `solc-js <https://github.com/ethereum/solc-js>`__
for compiling smart contracts. The package provides JavaScript bindings for the
Solidity compiler. It is slow, but easy to use and install in the JS ecosystem.

Because we value speed and flexibility we provide some alternatives that you can
use with Waffle. There are two other options:

1. Installing solc directly on your computer, see :ref:`native-solc`
2. Using solc installed in a docker container, see :ref:`dockerized-solc`

.. _native-solc:

Using native solc
-----------------

This is the fastest option but comes with some downsides. A system wide
installation means that you are stuck with a single Solidity version across all
of your projects. Additionally it might be complicated to install old versions
of the compiler using this method.

We recommend this option if you only care about the latest solidity version.

You can find detailed installation instructions for native :code:`solc` in the
`Solidity documentation <https://solidity.readthedocs.io/en/latest/installing-solidity.html#binary-packages>`__.

.. note::
  You need to install version compatible with your source files.

Change the :code:`compilerType` setting in your :code:`.waffle.json` file:

.. code-block:: json

  {
    "compilerType": "native"
  }

To read more about configuring Waffle, see :ref:`configuration`.

When compiling your smart contracts Waffle will now use the native solc installation.

.. _dockerized-solc:

Using dockerized solc
---------------------

This is the recommended option if you want flexibility when it comes to the
compiler version. It is pretty easy to set up, especially if you have Docker
installed.

If you don't have docker visit the `Docker documentation <https://www.docker.com/get-started>`__
to learn how to install it.

After you've installed docker you can install the Solidity compiler. Pull the
docker container tagged with the version you are interested in, for example for
version 0.4.24:

.. code-block:: text

  docker pull ethereum/solc:0.4.24

Then, change the :code:`compilerType` setting in your :code:`.waffle.json` file:

.. code-block:: json

  {
    "compilerType": "dockerized-solc",
    "compilerVersion": "0.4.24"
  }

If no :code:`compilerVersion` is specified the docker tag pulled defaults to
:code:`latest`. To read more about configuring Waffle, see :ref:`configuration`.

When compiling your smart contracts Waffle will now use the docker image you
pulled.

Using dockerized vyper
----------------------

This is the option if you have contracts in Vyper. You will need Docker installed.

To install docker visit the `Docker documentation <https://www.docker.com/get-started>`__
to learn how to do it.

To install dockerized Vyper pull the docker container tagged with the version you are interested in, for example for
version 0.1.0:

.. code-block:: text

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
