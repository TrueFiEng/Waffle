Fast compilation
================

By default, Waffle uses solcjs. Solcjs is solidity complier cross-complied to javascript. It is slow, but easy to install.
As an alternative, you can use the native Solidity compiler, which is faster. There are two options:
1) Native solc
2) Dockerized native solc



Native solc
-----------

This option is by far the fastest but requires you to install native solidity.
If you need an old version that might be somewhat complicated and require you to build `solidity` from sources.
Therefore it is the recommended option if you want to use latest solidity version.

You can find detailed installation instructions for native `solc` in
`documentation <https://solidity.readthedocs.io/en/latest/installing-solidity.html#binary-packages>`_.

**Note:** You need to install version compatible with your sources.

If you need the latest version that is pretty straight forward, see installation instructions below.

Installation
^^^^^^^^^^^^

MacOS
"""""

To install lastest versions on MacOS:
::

  brew install solidity


To install other versions, it seems that currently, you need to build it from source:

#. Download sources from `release list on GitHub <https://github.com/ethereum/solidity/releases>`_
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

This option is pretty easy to install especially if you have Docker installed.
This is the recommended option if you need to use old solidity version.
If you don't have docker use `following instructions <https://www.docker.com/get-started>`_ to install it.

Pull solc docker container tagged with the version you are interested in, for example for version 0.4.24:
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
