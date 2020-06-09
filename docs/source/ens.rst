.. _ens:

ENS
===

Creating a ENS
--------------

Creating a simple ENS for testing with :code:`ENS`.

.. code-block:: ts

  import {MockProvider} from '@ethereum-waffle/provider';
  import {deployENS, ENS} from '@ethereum-waffle/ens';

  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  const ens: ENS = await deployENS(wallet);

This class takes a :code:`wallet` in the constructor. The :code:`wallet` available in :code:`MockProvider` class in package :code:`@ethereum-waffle/provider`.

Setup ENS
---------

.. note::

  The feature was introduced in Waffle 3.0.0


Also, if you use :code:`MockProvider`, you can use :code:`setupENS()` function in :code:`MockProvider`,
to create and setup simple :code:`ENS`.

.. code-block:: ts

  import {MockProvider} from '@ethereum-waffle/provider';

  const provider = new MockProvider();
  await provider.setupENS();
  await provider.ens.createTopLevelDomain('test');

:code:`setupENS()` method employs the last of the provider's :code:`wallets` by default, but you can pass your own :code:`wallet` as an argument for :code:`setupENS(wallet)`.

Also :code:`setupENS()` method saves ENS address in the provider's networks.

Creating top level domain
-------------------------

Use :code:`createTopLevelDomain` function to create a top level domain:

.. code-block:: ts

  await ens.createTopLevelDomain('test');

Creating sub domain
-------------------

Use :code:`createSubDomain` function for creating a sub domain:

.. code-block:: ts

  await ens.createSubDomain('ethworks.test');

Creating sub domain with options
--------------------------------

.. note::

  The feature was introduced in Waffle 3.0.0

It is also possible to create a sub domain recursively, if the top domain doesn't exist, by specifying the appropriate option:

.. code-block:: ts

  await ens.createSubDomain('waffle.ethworks.tld', {recursive: true});

Setting address
---------------

Use :code:`setAddress` function for setting address for the domain:

.. code-block:: ts

  await ensBuilder.setAddress('vlad.ethworks.test', '0x001...03');

Setting address with options
----------------------------

.. note::

  The feature was introduced in Waffle 3.0.0


It is also possible to set an address for domain recursively, if the domain doesn't exist, by specifying the appropriate option:

.. code-block:: ts

  await ens.setAddress('vlad.waffle.ethworks.tld', '0x001...03', {recursive: true});

Use :code:`setAddressWithReverse` function for setting address for the domain and make this domain reverse. Add recursive option if the domain doesn't exist:

.. code-block:: ts

  await ens.setAddressWithReverse('vlad.ethworks.tld', wallet, {recursive: true});
