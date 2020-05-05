Experimental Features
=====================

A set of experimental Waffle features. Below is the list of available features:

.. Warning::
  Breaking changes will not result in a new major version.

Mock contract
-----------------------------
Mocking your smart contract dependencies.

Create an instance of a mock contract providing the ABI/interface of the smart contract you want to mock:

.. code-block:: js

  import {deployMockContract} from '@ethereum-waffle/mock-contract';

  ...

  const mockContract = await deployMockContract(wallet, contractAbi);

Mock contract can now be passed into other contracts by using the :code:`address` attribute.
Return values for mocked functions can be set using:

.. code-block:: js

  await mockContract.mock.<nameOfMethod>.returns(<value>)
  await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).returns(<value>)

Methods can also be set up to be reverted using:

.. code-block:: js

  await mockContract.mock.<nameOfMethod>.reverts()
  await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).reverts()


Dockerized vyper for compilation
-----------------------------------------------
This is the option if you have contracts in Vyper. You will need Docker installed.

To install docker visit the `Docker documentation <https://www.docker.com/get-started>`__
to learn how to do it.

To install dockerized Vyper pull the docker container tagged with the version you are interested in, for example for
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
