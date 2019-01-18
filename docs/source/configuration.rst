Configuration
=============

Waffle configuration file
-------------------------
Waffle takes as a first argument configuration file. The configuration file can be of type JSON, e.g.:
::

  {
    "sourcesPath": "./some_custom/contracts_path",
    "targetPath": "../some_custom/build",
    "npmPath": "./other/node_modules"
  }

Configuration can also be of type js, e.g.:
::

  module.exports = {
    npmPath: "../node_modules",
    compiler: process.env.WAFFLE_COMPILER,
    legacyOutput: true
  };


Native and dockerized solc compiler configuration is described in "Fast compilation" section.


Solcjs and version management
-----------------------------
Solcjs allows switching used version of solidity compiler on the fly. To set up a chosen version of solidity compiler add the following line in the Waffle configuration file:
::

  {
    ...
    "solcVersion": "v0.4.24+commit.e67f0147"
  }


Version naming is somewhat counter-intuitive. You can deduce version name from `list available here <https://ethereum.github.io/solc-bin/bin/list.json>`_.


Legacy / Truffle compatibility
------------------------------

Starting with Waffle 2.0, the format of contract output .json files in solidity standard JSON. This is not compatible with older Waffle versions and with Truffle.
You can generate files that are compatible with both current and previous versions by adding "legacyOutput": "true" flag Waffle in the configuration file:
::

  {
    ...
    "legacyOutput": "true"
  }
