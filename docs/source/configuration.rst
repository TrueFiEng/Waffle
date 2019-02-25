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


Custom compiler options
-----------------------
To provide custom compiler options in waffle configuration file use compilerOptions section. Example below.

::

  {
    "compilerOptions": {
      "evmVersion": "constantinople"
    },
    "compiler": "native"
  }

For detailed list of options go to
`solidity documentation <https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html#using-the-compiler>`_
(sections: `'Setting the EVM version to target' <https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html#setting-the-evm-version-to-target>`_,
`'Target options' <https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html#target-options>`_ and `'Compiler Input and Output JSON Description' <https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html#compiler-input-and-output-json-description>`_).


Monorepo
--------
Waffle works well with mono-repositories. It is enough to set up common npmPath in the configuration file to make it work.
We recommend using `yarn workspaces <https://yarnpkg.com/lang/en/docs/workspaces/>`_ and `wsrun <https://github.com/whoeverest/wsrun>`_ for monorepo management.

Lernajs + Native solc
^^^^^^^^^^^^^^^^^^^^^
Waffle works with `lerna <https://lernajs.io/>`_, but require additional configuration.
When lerna cross-links npm packages in monorepo, it creates symbolic links to original catalog.
That leads to sources files located beyond allowed paths. This process breaks compilation with native solc.


If you see a message like below in your monorepo setup:
::

  contracts/Contract.sol:4:1: ParserError: Source ".../monorepo/node_modules/YourProjectContracts/contracts/Contract.sol" not found: File outside of allowed directories.
  import "YourProjectContracts/contracts/Contract.sol";


you probably need to add allowedPath to your waffle configuration.

Assuming you have the following setup:
::

  /monorepo
    /YourProjectContracts
      /contracts
    /YourProjectDapp
      /contracts

Add to waffle configuration in YourProjectDapp:
::

  {
    ...
    allowedPath: ["../YourProjectContracts"]
  }


That should solve a problem.

Currently Waffle does not support similar feature for dockerized solc.
