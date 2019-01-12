Fast compilation
================

By default, Waffle uses solcjs. Solcjs is solidity complier cross-complied to javascript. It is slow, but easy to install.
As an alternative, you can use the native Solidity compiler, which is faster. There are two options:
1) Native solc
2) Dockerized native solc



Native solc
-----------

This option is by far the fastest, but requires you to install native solidity.
If you need an old version that might be somewhat complicated and require you to build `solidity` from sources.
Therefore it is recommended option if you want to use latest solidity version.

You can find detailed installation instructions for native `solc` in
`documentation <https://solidity.readthedocs.io/en/latest/installing-solidity.html#binary-packages>`_.

**Note:** You need to install version compatible with your sources.

If you need latest version that is pretty straight forward. See Installation instructions below.

Installation
^^^^^^^^^^^^

MacOS
"""""

To install lastest versions on MacOS:
::

  brew install solidity


To install other versions, it seems that currently it easiest to build from source:

#. Download sources from `release list on github <https://github.com/ethereum/solidity/releases>`_
#. Follow installation instructions in the `documentation <https://solidity.readthedocs.io/en/develop/installing-solidity.html#building-from-source>`_

Ubuntu
""""""

To install lastest versions on Ubuntu:
::

  sudo add-apt-repository ppa:ethereum/ethereum
  sudo apt-get update
  sudo apt-get install solc


Project setup
^^^^^^^^^^^^^

Setup compiler in your waffle configuration file:
::

  {
    ...
    "compiler": "native"
  }


You can now run tests with native solc, eg:
::

  npx waffle



Dockerized solc
---------------

This options is pretty easy to install especially if you have docker installed.
This is recommended option if you need to use old solidity version.
If you don't have docker use `following instructions <https://www.docker.com/get-started>`_ to install it.

Pull solc docker container tagged with version you are interested in, for example for version 0.4.24 it will be:
::


  docker pull ethereum/solc:0.4.24


Than setup compiler in your waffle configuration file:
::

  {
    ...
    "compiler": "dockerized-solc",
    "docker-tag": "0.4.24"
  }


Default docker tag is `latest`.

You can now run tests in docker.


Solcjs and version management
-----------------------------
Solcjs allows to switch used version of solidity compiler on the fly. To setup version solidity compiler version add following line in waffle configuration file:
::

  {
    ...
    "solcVersion": "v0.4.24+commit.e67f0147"
  }


Version naming is somewhat counter-intuitive. You can deduce version name from `list available here <https://ethereum.github.io/solc-bin/bin/list.json>`_.
