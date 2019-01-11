Fast tests
================


Fast compilation
----------------

By default, Waffle uses solcjs. Solcjs is solidity complier cross-complied to javascript. It is slow, but easy to install.
As an alternative, you can use the original Solidity compiler, which is faster. There are two options:
1) Dockerized solc
2) Native solc


Dockerized solc (experimental)
------------------------------

This options is pretty easy to install especially if you have docker installed. This is recommended option. If you don't have docker [follow instructions](https://www.docker.com/get-started).

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

Native solc
-----------

This option is by far the fastest but requires you to install native solidity. If you need a legacy version that might be somewhat complicated and require you to build `solidity` from sources.

You can find detailed installation instructions for native `solc` in (documentation)[https://solidity.readthedocs.io/en/latest/installing-solidity.html#binary-packages].


You need to install version compatible with your sources. If you need latest version that is pretty straight forward. See Installation instructions below.

Installation instructions for latest version of solidity
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
**MacOS**
To install lastest versions on MacOS:
::

  brew install solidity


To install other versions, it seems that currently it easiest to build from source:
1. Download sources from (release list on github)[https://github.com/ethereum/solidity/releases]
2. Follow installation instructions in the (documentation)[https://solidity.readthedocs.io/en/develop/installing-solidity.html#building-from-source]

**Ubuntu**

To install lastest versions on Ubuntu:
::

  sudo add-apt-repository ppa:ethereum/ethereum
  sudo apt-get update
  sudo apt-get install solc


**Project setup**

Setup compiler in your waffle configuration file:
::

  {
    ...
    "compiler": "native"
  }


To do some detective work and figure out command for particular version go here:

You can now run tests with native solc, eg:
::

  npx waffle


Solcjs and version management
-----------------------------
You can setup version which solidity compiler version you would like to use with `solcjs` in waffle configuration file, e.g.:
::

  {
    ...
    "solcVersion": "v0.4.24+commit.e67f0147"
  }


Version naming is somewhat unintuitive. You can deduce version name from [list available here] (https://ethereum.github.io/solc-bin/bin/list.json).