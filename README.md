[![Build Status](https://travis-ci.com/EthWorks/Waffle.svg?token=xjj4U84eSFwEsYLTc5Qe&branch=master)](https://travis-ci.com/EthWorks/Waffle)
[![](https://img.shields.io/npm/v/ethereum-waffle.svg)](https://www.npmjs.com/package/ethereum-waffle)

![Ethereum Waffle](https://raw.githubusercontent.com/EthWorks/Waffle/master/docs/images/logo.png)

Library for writing and testing smart contracts.

Sweeter, simpler and faster than Truffle.

## Philosophy
* __Simpler__: Minimalistic, few dependencies.
* __Sweeter__: Nice syntax, easy to extend.
* __Faster__: Strong focus on the speed of test execution.

## Features:
* Sweet set of chai matchers, e.g.:
  * `expect(...).to.be.revertedWith('Error message')`
  * `expect(...).to.emitEvent(contract, 'EventName).withArgs(...)`)
* Importing contracts from npm modules working out of the box, e.g.:
  * `import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";`
* Fixtures that help write fast and maintainable test suites, e.g.:
  * `const {token} = await loadFixture(standardTokenWithBalance);`
* Sub-second compilation with native and dockerized solc
* Support for TypeScript
* [Documentation](https://ethereum-waffle.readthedocs.io/en/latest/)


## Documentation
Documentation is available [here](https://ethereum-waffle.readthedocs.io/en/latest/).

## Installation:
To get started using npm, type:
```sh
npm i ethereum-waffle
```

or with Yarn:
```sh
yarn add ethereum-waffle
```

## Step by step guide

### Add external dependency:
To add an external library install it using npm:

```sh
npm i openzeppelin-solidity
```

### Example contract
Below is an example contract written in Solidity. Place it in `contracts` directory of your project:

```solidity
pragma solidity ^0.5.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


// Example class - a mock class using delivering from ERC20
contract BasicTokenMock is ERC20 {
  constructor(address initialAccount, uint256 initialBalance) public {
    super._mint(initialAccount, initialBalance);
  }
}
```

### Example test
Below is an example test written for the contract above compiled with Waffle. Place it in `test` directory of your project:

```js
import chai from 'chai';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
import BasicTokenMock from './build/BasicTokenMock';
import MyLibrary from './build/MyLibrary';
import LibraryConsumer from './build/LibraryConsumer';

chai.use(solidity);
const {expect} = chai;

describe('INTEGRATION: Example', () => {
  let provider = createMockProvider();
  let [wallet, walletTo] = getWallets(provider);
  let token;

  beforeEach(async () => {
    token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);
  });

  it('Assigns initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.eq(1000);
  });

  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo.address, 7);
    expect(await token.balanceOf(walletTo.address)).to.eq(7);
  });

  it('Transfer emits event', async () => {
    await expect(token.transfer(walletTo.address, 7))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 7);
  });

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  });

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = token.connect(walletTo);
    await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
      .to.be.reverted;
  });

});
```

### Compiling
To compile your smart contracts run:
```sh
npx waffle
```

To compile using a custom configuration file run:
```sh
npx waffle config.json
```

Example configuration file looks like this (all fields optional):
```json
{
  "sourcesPath": "./custom_contracts",
  "targetPath": "./custom_build",
  "npmPath": "./custom_node_modules"
}
```

### Running tests
To run the tests run the following command:
```sh
mocha
```

### Adding an npm script
For convinience, you can add the following to your `package.json`:
```json
{
  "scripts": {
    "test": "waffle && mocha"
  }
}
```

Now you can build and test your contracts with one command:
```sh
npm test
```

## Documentation
For detailed feature walkthrough checkout [documentation](https://ethereum-waffle.readthedocs.io/en/latest/).



## Contributing

Contributions are always welcome, no matter how large or small. Before contributing, please read the [code of conduct](https://github.com/EthWorks/Waffle/blob/master/CODE_OF_CONDUCT.md) and [contribution policy](https://github.com/EthWorks/Waffle/blob/master/CONTRIBUTION.md).

Before you issue pull request:

Make sure all tests and linters pass.
Make sure you have test coverage for any new features.


### Running tests
Note: To make end-to-end test pass, you need to:
* have Docker installed, up and running
* have native solidity 0.5.* installed

To run tests type:
```sh
yarn test
```

To run linter type:
```sh
yarn lint
```

Building documentation:
```sh
cd docs
make html
```


## Roadmap

### Waffle 2.0
- [x] New matcher: changeBalance (see [#9](https://github.com/EthWorks/Waffle/issues/9))
- [x] Faster compilation with native and dockerized solc (aside from solcjs)
- [x] Documentation
- [x] TypeScript rewrite

### Waffle 2.1
- [ ] Faster testing with native geth (aside from ganache)
- [ ] New matcher: changeBalance for ERC20 tokens

### Waffle 2.2
- [ ] Debugging and profiling

## License
Waffle is released under the [MIT License](https://opensource.org/licenses/MIT).

