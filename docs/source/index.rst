Waffle Documentation
====================

.. image:: logo.png

Waffle is a library for writing and testing smart contracts.

Sweeter, simpler and faster than Truffle.

Works with ethers-js.

Philosophy:
-----------
- **Simpler**: Minimalistic, few dependencies.
- **Sweeter**: Nice syntax, easy to extend.
- **Faster**: Focus on the speed of tests execution.

Features:
---------
- Sweet set of chai matchers,
- Easy contract importing from npm modules,
- Fast compilation with native and dockerized solc,
- Typescript compatible,
- Fixtures that help write fast and maintainable test suites,
- Well documented.

Versions and ethers compatibility
---------------------------------
- Use version :code:`0.2.3` with ethers 3 and solidity 4,
- Use version :code:`1.2.0` with ethers 4 and solidity 4,
- Use version :code:`2.*.*` with ethers 4, solidity 4, 5 and ability to use native or dockerized solc.
- Use version :code:`3.*.*` with ethers 5, solidity 4, 5, 6 and ability to use native, dockerized solc or dockerized vyper.

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   getting-started.rst
   compilation.rst
   basic-testing.rst
   matchers.rst
   fixtures.rst
   configuration.rst
   mock-contract.rst
   ens.rst
