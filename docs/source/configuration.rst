.. _configuration:

Configuration
=============

Configuration file
------------------

While Waffle works well enough without any configurations, advanced users might
want to excert more control over what happens when they use Waffle in their
projects.

This is why we made it very easy to configure Waffle to meet your needs. All
you need to do is create a :code:`waffle.json` file inside your project and
point waffle to it.

First create your :code:`waffle.json` configuration file:

.. code-block:: json

  {
    "compilerType": "solcjs",
    "compilerVersion": "0.6.2",
    "sourceDirectory": "./src",
    "outputDirectory": "./build"
  }

.. note::

  Each configuration is optional.

Afterwards update your :code:`package.json` build script:

.. note::

  Since Waffle 3.0.0 it recognises :code:`waffle.json` as the default configuration file. If your configuration file is called
  :code:`waffle.json`, it's possible to use just :code:`waffle` to build contracts.

.. tabs::

  .. group-tab:: Waffle 3.0.0

    .. code-block:: json

      {
        "scripts": {
          "build": "waffle"
        }
      }

  .. group-tab:: Waffle 2.5.0
    .. code-block:: json

      {
        "scripts": {
          "build": "waffle waffle.json"
        }
      }


Configuration options:

- :ref:`sourceDirectory`
- :ref:`outputDirectory`
- :ref:`nodeModulesDirectory`
- :ref:`cacheDirectory`
- :ref:`compilerType`
- :ref:`compilerVersion`
- :ref:`compilerAllowedPaths`
- :ref:`compilerOptions`
- :ref:`outputHumanReadableAbi`
- :ref:`outputType`

.. _sourceDirectory:

sourceDirectory
^^^^^^^^^^^^^^^

You can specify a custom path to the directory containing your smart contracts.
Waffle uses :code:`./contracts` as the default value for :code:`sourceDirectory`.
The path you provide will be resolved relative to the current working directory.

Example:

.. code-block:: json

  {
    "sourceDirectory": "./custom/path/to/contracts"
  }

.. _outputDirectory:

outputDirectory
^^^^^^^^^^^^^^^

You can specify a custom path to the directory to which Waffle saves the
compilation output. Waffle uses :code:`./build` as the default value for
:code:`outputDirectory`. The path you provide will be resolved relative to the
current working directory.

Example:

.. code-block:: json

  {
    "outputDirectory": "./custom/path/to/output"
  }

.. _nodeModulesDirectory:

nodeModulesDirectory
^^^^^^^^^^^^^^^^^^^^

You can specify a custom path to the :code:`node_modules` folder which Waffle
will use to resolve third party dependencies. Waffle uses :code:`./node_modules`
as the default value for :code:`nodeModulesDirectory`. The path you provide
will be resolved relative to the current working directory.

For more information about third party libraries, see :ref:`third-party`.

Example:

.. code-block:: json

  {
    "nodeModulesDirectory": "./custom/path/to/node_modules"
  }


.. _cacheDirectory:

cacheDirectory
^^^^^^^^^^^^^^

When compiling using :code:`solcjs` and using a non-default :code:`compilerVersion`
Waffle downloads the necessary :code:`solcjs` binary from a remote server. This file
is cached to speed up subsequent runs. You can specify a custom path to the directory
in which caches are saved. Waffle uses :code:`./cache` as the default value for
:code:`cacheDirectory`. The path you provide will be resolved relative to the current
working directory.

Example:

.. code-block:: json

  {
    "cacheDirectory": "./custom/path/to/cache"
  }



.. _compilerType:

compilerType
^^^^^^^^^^^^

Specifies the compiler to use. For more information see: :ref:`compile-times`.
Allowed values:

  - :code:`solcjs`
  - :code:`native`
  - :code:`dockerized-solc`
  - :code:`dockerized-vyper`

Waffle uses :code:`solcjs` as the default value for
:code:`compilerType`.

Example:

.. code-block:: json

  {
    "compilerType": "dockerized-solc"
  }


.. _compilerVersion:

compilerVersion
^^^^^^^^^^^^^^^

Specifies the version of the compiler. Should be a semver string like
:code:`0.5.9`. You can use it with :code:`"compilerType": "solcjs"` or
:code:`"compilerType": "dockerized-solc"`.

When using :code:`"compilerType": "solcjs"` you can also specify the exact
commit that will be used or a path to a specific solc module dependency.

To find a specific commit please consult the `list of available solc versions <https://ethereum.github.io/solc-bin/bin/list.json>`__.

Examples:

.. code-block:: json

  {
    "compilerType": "dockerized-solc",
    "compilerVersion": "0.4.24"
  }

.. code-block:: json

  {
    "compilerType": "solcjs",
    "compilerVersion": "v0.4.24+commit.e67f0147"
  }

.. code-block:: json

  {
    "compilerType": "solcjs",
    "compilerVersion": "./node_modules/solc"
  }

.. _compilerAllowedPaths:

compilerAllowedPaths
^^^^^^^^^^^^^^^^^^^^

The :code:`solc` compiler has restrictions on paths it can access for security
reasons. The value of :code:`compilerAllowedPaths` will be passed as a command
line argument: :code:`solc --allow-paths <VALUE>`.

This is especially useful if you are doing a monorepo setup with Lerna,
see: :ref:`lerna`.

Example:

.. code-block:: json

  {
    "compilerAllowedPaths": ["../contracts"]
  }


.. _compilerOptions:

compilerOptions
^^^^^^^^^^^^^^^

You can customize the behaviour of :code:`solc` by providing custom settings for
it. All of the information is provided in the `Solidity documentation <https://solidity.readthedocs.io/en/v0.5.12/using-the-compiler.html#input-description>`__. Value of the :code:`compilerOptions`
configuration setting will be passed to :code:`solc` as :code:`settings`.

For detailed list of options go to
`solidity documentation <https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html#using-the-compiler>`_
(sections: `'Setting the EVM version to target' <https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html#setting-the-evm-version-to-target>`_,
`'Target options' <https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html#target-options>`_ and `'Compiler Input and Output JSON Description' <https://solidity.readthedocs.io/en/v0.5.1/using-the-compiler.html#compiler-input-and-output-json-description>`_).

Example:

.. code-block:: json

  {
    "compilerOptions": {
      "evmVersion": "constantinople"
    }
  }

.. _outputType:

outputType
^^^^^^^^^^

See: :ref:`klab`.

.. _outputHumanReadableAbi:

outputHumanReadableAbi
^^^^^^^^^^^^^^^^^^^^^^

Waffle supports `Human Readable Abi <https://blog.ricmoo.com/human-readable-contract-abis-in-ethers-js-141902f4d917>`__.

In order to enable its output, you need to set :code:`outputHumanReadableAbi` to :code:`true` in your config file:

.. code-block:: json

  {
    "outputHumanReadableAbi": true
  }

For the compiled contracts you will now see the following in the output:

.. code-block:: json

  {
    "humanReadableAbi": [
      "constructor(uint256 argOne)",
      "event Bar(bool argOne, uint256 indexed argTwo)",
      "event FooEvent()",
      "function noArgs() view returns(uint200)",
      "function oneArg(bool argOne)",
      "function threeArgs(string argOne, bool argTwo, uint256[] argThree) view returns(bool, uint256)",
      "function twoReturns(bool argOne) view returns(bool, uint256)"
    ]
  }


Other configuration file formats
--------------------------------

Waffle supports the following configuration file formats:

*JSON*:

.. code-block:: json

  {
    "sourceDirectory": "./src/contracts",
  }

*JavaScript*:

.. code-block:: ts

  module.exports = {
    sourceDirectory: './src/contracts'
  }

The configuration can even be a promise

.. code-block:: ts

  module.exports = Promise.resolve({
    sourceDirectory: './src/contracts'
  })

.. hint::
  This is a powerful feature if you want to asynchronously load different compliation configurations
  in different environments.
  For example, you can use native solc in CI for faster compilation, while deciding the exact
  solc-js version locally based on the contract versions being used. Since many of those operations
  are asynchronous, you'll most likely be returning a Promise to waffle to handle.

Setting Solidity compiler version
---------------------------------

See :ref:`compilerVersion`.

Usage with Truffle
------------------

Waffle output should be compatible with Truffle by default.

Custom compiler options
-----------------------

See :ref:`compilerOptions`.

.. _klab:

KLAB compatibility
------------------

The default compilation process is not compatible with KLAB
(a formal verification tool, see: https://github.com/dapphub/klab). To compile contracts to work with KLAB one must:

1. Set appropriate compiler options, i.e.:

.. code-block:: ts

  compilerOptions: {
    outputSelection: {
      "*": {
        "*": [ "evm.bytecode.object", "evm.deployedBytecode.object",
               "abi" ,
               "evm.bytecode.sourceMap", "evm.deployedBytecode.sourceMap" ],

        "": [ "ast" ]
      },
    }
  }


2. Set appropriate output type. We support two types: one (default) generates a single file for each contract
and the other (KLAB friendly) generates one file (Combined-Json.json) combining all contracts. The latter type does not meet
(in contrary to the first one) all official solidity standards since KLAB requirements are slightly modified.
Set the output in the config file:


Possible options are:

- `'multiple'`: a single file for each contract;
- `'combined'`: one KLAB friendly file;
- `'all'`: generates both above outputs;
- `'minimal'`: a single file for each contract with minimal information (just abi and bytecode).

.. note::

  `'minimal'` option was introduced in Waffle 3.0.0.

.. code-block:: json

  {
    "outputType": "combined"
  }

An example of full KLAB friendly config file:

.. code-block:: ts

  module.exports = {
    compilerType: process.env.WAFFLE_COMPILER,
    outputType: 'all',
    compilerOptions: {
      outputSelection: {
        "*": {
          "*": [ "evm.bytecode.object", "evm.deployedBytecode.object",
                 "abi" ,
                 "evm.bytecode.sourceMap", "evm.deployedBytecode.sourceMap" ],

          "": [ "ast" ]
        },
     }
   }
  };

.. _monorepo:

Monorepo
--------
Waffle works well with mono-repositories. It is enough to set up a common :code:`nodeModulesDirectory` in the configuration file to make it work.
We recommend using `yarn workspaces <https://yarnpkg.com/lang/en/docs/workspaces/>`_ and `wsrun <https://github.com/whoeverest/wsrun>`_ for monorepo management.

.. _lerna:

Usage with Lernajs
------------------

Waffle works with `lerna <https://lernajs.io/>`__, but requires additional configuration.
When lerna cross-links npm packages in monorepo, it creates symbolic links to the original catalog.
They lead to sources files located beyond allowed paths. This process breaks compilation with native solc.


If you see the following message in your monorepo setup:

.. code-block:: text

  contracts/Contract.sol:4:1: ParserError: Source ".../monorepo/node_modules/YourProjectContracts/contracts/Contract.sol" not found: File outside of allowed directories.
  import "YourProjectContracts/contracts/Contract.sol";


you probably need to add allowedPath to your waffle configuration.

Assuming you have the following setup:

.. code-block:: text

  /monorepo
    /YourProjectContracts
      /contracts
    /YourProjectDapp
      /contracts

Add to waffle configuration in YourProjectDapp:

.. code-block:: json

  {
    "compilerAllowedPaths": ["../YourProjectContracts"]
  }


That should solve a problem.

Currently Waffle does not support a similar feature for dockerized solc.
