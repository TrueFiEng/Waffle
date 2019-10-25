.. _configuration:

Configuration
=============

Configuration file
------------------

While Waffle works well enough without any configurations advanced users might
want to excert more control over what happens when they use Waffle in their
projects.

This is why we made it very easy to configure Waffle to match your needs. All
you need to do is create a :code:`.waffle.json` file inside your project and
point waffle to it.

First create your :code:`.waffle.json` configuration file:

.. code-block:: json

  {}

.. note::

  All of the configuration options are optional.

Afterwards update your :code:`package.json` build script:

.. code-block:: json

  {
    "scripts": {
      "build": "waffle .waffle.json"
    }
  }

Next, you will learn about the configuration options:

- :ref:`sourcesPath`
- :ref:`targetPath`
- :ref:`npmPath`
- :ref:`compiler`
- :ref:`docker-tag`
- :ref:`solcVersion`
- :ref:`legacyOutput`
- :ref:`allowedPaths`
- :ref:`compilerOptions`
- :ref:`outputType`
- :ref:`outputHumanReadableAbi`
- :ref:`ganacheOptions`

.. _sourcesPath:

sourcesPath
^^^^^^^^^^^

You can specify a custom path to the directory containing your smart contracts.
Waffle uses :code:`./contracts` as the default value for :code:`./sourcesPath`.

Example:

.. code-block:: json

  {
    "sourcesPath": "./custom/path/to/contracts"
  }

.. _targetPath:

targetPath
^^^^^^^^^^

You can specify a custom path to the directory to which Waffle saves the
compilation output. Waffle uses :code:`./build` as the default value for
:code:`./targetPath`.

Example:

.. code-block:: json

  {
    "targetPath": "./custom/path/to/output"
  }

.. _npmPath:

npmPath
^^^^^^^

You can specify a custom path to the :code:`node_modules` folder which Waffle
will use to resolve third party dependencies. Waffle uses :code:`node_modules`
as the default value for :code:`./npmPath`.

For more information about third party libraries, see :ref:`third-party`.

Example:

.. code-block:: json

  {
    "npmPath": "./custom/path/to/node_modules"
  }


.. _compiler:

compiler
^^^^^^^^

Specifies the compiler to use. For more information see: :ref:`compile-times`.
Allowed values:

  - :code:`solcjs` (default)
  - :code:`native`
  - :code:`dockerized-solc`

Example:

.. code-block:: json

  {
    "compiler": "dockerized-solc"
  }


.. _docker-tag:

docker-tag
^^^^^^^^^^

Specifies the docker tag. Only use alongside :code:`"compiler": "dockerized-solc"`.
For more information, see: :ref:`dockerized-solc`.

Example:

.. code-block:: json

  {
    "compiler": "dockerized-solc",
    "docker-tag": "0.4.24"
  }

.. _solcVersion:

solcVersion
^^^^^^^^^^^

`solc-js <https://github.com/ethereum/solc-js>`__ allows setting the version
of the solidity compiler on the fly. To change the version of the solidity
compiler update the value of the :code:`solcVersion` field in your config file:

.. code-block:: json

  {
    "solcVersion": "v0.4.24+commit.e67f0147"
  }

To find an appropriate version name please consult the `list of available solc versions <https://ethereum.github.io/solc-bin/bin/list.json>`__.

Instead of specifying a version tag you can pass the path to the solc-js package.

.. code-block:: json

  {
    "solcVersion": "./node_modules/solc"
  }


.. _legacyOutput:

legacyOutput
^^^^^^^^^^^^

Starting with Waffle 2.0, the format of contract output JSON files is the
solidity standard JSON. This is not compatible with older Waffle versions and
with Truffle.

You can generate files that are compatible with both current and previous
versions by setting :code:`"legacyOutput": "true"` in the configuration file:

.. code-block:: json

  {
    "legacyOutput": "true"
  }

.. _allowedPaths:

allowedPaths
^^^^^^^^^^^^

The :code:`solc` compiler has restrictions on paths it can access for security
reasons. The value of :code:`allowedPaths` will be passed as a command line
argument: :code:`solc --allow-paths <VALUE>`.

This is especially useful if you are doing a monorepo setup with Lerna,
see: :ref:`monorepo`.

Example:

.. code-block:: json

  {
    "allowedPaths": ["../contracts"]
  }


.. _compilerOptions:

compilerOptions
^^^^^^^^^^^^^^^

You can customize the behaviour of :code:`solc` by providing custom settings for
it. All of the information is provided in the `Solidity documentation <https://solidity.readthedocs.io/en/v0.5.12/using-the-compiler.html#input-description>`__. Value of the :code:`compilerOptions`
configuration setting will be passed to :code:`solc` as :code:`settings`.

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

In order to enable its output you need to set :code:`outputHumanReadableAbi` to :code:`true` in your config file:

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


.. _ganacheOptions:

ganacheOptions
^^^^^^^^^^^^^^

Values specified here will be read by :code:`createMockProvider` if passed the
path to the config file.

Example:

.. code-block:: json

  {
    "ganacheOptions": {
      "gasLimit": 50,
      "gasPrice": 1
    }
  }


Other configuration file formats
--------------------------------

Waffle takes as a first argument configuration file. The configuration file can be of type JSON, e.g.:

.. code-block:: json

  {
    "sourcesPath": "./some_custom/contracts_path",
    "targetPath": "../some_custom/build",
    "npmPath": "./other/node_modules"
  }

Configuration can also be of type js, e.g.:

.. code-block:: js

  module.exports = {
    npmPath: "../node_modules",
    compiler: process.env.WAFFLE_COMPILER,
    legacyOutput: true
  };


Native and dockerized solc compiler configuration is described in "Fast compilation" section.

Configuration can even be a Promise in a js, e.g.:

.. code-block:: js

  module.exports = new Promise((resolve, reject) => {
    resolve({
      "compiler": "native"
    });
  });

.. hint::
  This is a powerful feature if you want to asynchronously load different compliation configurations in different environments.
  For example, you can use native solc in CI for faster compilation, whereas deciding the exact solc-js version locally based on the contract versions being used, since many of those operations are asynchronous, you'll most likely be returning a Promise to waffle to handle.

Setting Solidity compiler version
---------------------------------

See :ref:`solcVersion`.

Usage with Truffle
------------------

See :ref:`legacyOutput`.

Usage with old Waffle versions
------------------------------

See :ref:`legacyOutput`.

Custom compiler options
-----------------------
To provide custom compiler options in waffle configuration file use compilerOptions section. Example below.

.. code-block:: json

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


.. _klab:

KLAB compatibility
------------------

The default compilation process is not compatible with KLAB
(a formal verification tool, see: https://github.com/dapphub/klab). To compile contracts to work with KLAB one must:

1. Set appropriate compiler options, i.e.:

.. code-block:: js

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


2. Set appropriate output type. We support two types: one (default) generates single file for each contract
and second (KLAB friendly) generates one file (Combined-Json.json) combining all contracts. The second type does not meet
(in contrary to the first one) all official solidity standards since KLAB requirements are slightly modified.
To choice of the output is set in config file, i.e.:

::

  outputType: 'combined'

Possible options are:
- `'multiple'`: single file for each contract;
- `'combined'`: one KLAB friendly file;
-  `'all'`: generates both above outputs.

An example of full KLAB friendly config file:

.. code-block:: js

  module.exports = {
    compiler: process.env.WAFFLE_COMPILER,
    legacyOutput: true,
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

.. code-block:: json

  {
    "allowedPaths": ["../YourProjectContracts"]
  }


That should solve a problem.

Currently Waffle does not support similar feature for dockerized solc.
