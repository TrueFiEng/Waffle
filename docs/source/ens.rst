ENS
=============

Creating a ENS builder
----------------------

Creating a simple ens builder for testing with :code:`ENS`.

.. code-block:: ts

  import {MockProvider} from '@ethereum-waffle/provider';
  import {createENSBuilder, ENSBuilder} from '@ethereum-waffle/ens';

  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  const ensBuilder: ENSBuilder = await createENSBuilder(wallet);

This class takes a :code:`wallet` in the constructor. The :code:`wallet` available in :code:`MockProvider` class in package :code:`@ethereum-waffle/provider`.

Creating top level domain
-------------------------

Use :code:`createTopLevelDomain` function to creating top level domain:

.. code-block:: ts

  await ensBuilder.createTopLevelDomain('test');

Creating sub domain
-------------------

Use :code:`createSubDomain` function to creating sub domain for exiting domain:

.. code-block:: ts

  await ensBuilder.createSubDomain('ethworks.test');

Setting address for existing domain
-----------------------------------

And use :code:`setAddress` function for setting address for existing domain:

.. code-block:: ts

  await ensBuilder.setAddress('vlad.ethworks.test', '0x001...03');
