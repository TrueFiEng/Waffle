[![Build Status](https://travis-ci.com/EthWorks/Waffle.svg?token=xjj4U84eSFwEsYLTc5Qe&branch=master)](https://travis-ci.com/EthWorks/Waffle)

![Ethereum Waffle](https://raw.githubusercontent.com/EthWorks/Waffle/master/docs/images/logo.png)

Library for writing and testing smart contracts.

Sweeter, simpler, faster. Works with [ethers-js](https://github.com/ethers-io/ethers.js/).
Documentation available [here](https://ethereum-waffle.readthedocs.io/en/latest/).

## Philosophy
* __Simpler__: minimalistic, a couple of helpers, matchers and tasks rather than a framework, few dependencies.
* __Sweeter__: Nice syntax, fast, easy to extend.
* __Faster__: Focus on the speed of tests execution, the goal is to have subsecond feedback loop when doing TDD with smart contracts.


## Versions and ethers compatibility
* Use version 0.2.3+ with ethers 3.* and solidity 4.*
* Use version 1.0.0+ with ethers 4.* and solidity 4.*
* Use version 2.0.5-beta with ethers 4.*; solidity 4, 5 and to use experimental native solc and dockerized solc.

## Install:
To start using with npm, type:
```sh
npm i ethereum-waffle
```

or with Yarn:
```sh
yarn add ethereum-waffle
```

## Step by step guide

### Example contract
Below is example contract written in Solidity. Place it in `contracts` directory of your project:

```solidity
pragma solidity ^0.5.1;

import "../BasicToken.sol";

contract BasicTokenMock is BasicToken {

  constructor(address initialAccount, uint256 initialBalance) public {
    balances[initialAccount] = initialBalance;
    totalSupply_ = initialBalance;
  }

}
```

### Example test
Belows is example test written for the contract above written with Waffle. Place it in `test` directory of your project:

```js
import chai from 'chai';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
import BasicTokenMock from './build/BasicTokenMock';

chai.use(solidity);

const {expect} = chai;

describe('Example', () => {
  let provider;
  let token;
  let wallet;
  let walletTo;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, walletTo] = await getWallets(provider);
    token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);
  });

  it('Assigns initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.eq(1000);
  });

  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo.address, 7);
    expect(await token.balanceOf(wallet.address)).to.eq(993);
    expect(await token.balanceOf(walletTo.address)).to.eq(7);
  });

  it('Transfer emits event', async () => {
    await expect(token.transfer(walletTo.address, 7))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 7);
  });

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = contractWithWallet(token, walletTo);
    await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
      .to.be.revertedWith('Not enough balance on sender account');
  });
});
```

### Compile
To compile contracts simply type:
```sh
npx waffle
```

To compile using custom configuration file:
```sh
npx waffle config.json
```

Example configuration file looks like this:
```json
{
  "sourcesPath": "./custom_contracts",
  "targetPath": "./custom_build",
  "npmPath": "./custom_node_modules"
}
```

### Run tests
To run test type in the console:
```sh
mocha
```

### Adding a task
For convince, you can add a task to your `package.json`. In the sections `scripts`, add following line:
```json
  "test": "waffle && test"
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


## Running tests
Note: To make end to end test pass, you need to:
* have docker installed, up and running
* have native solidity 0.5.* installed

To run tests type:
```sh
yarn test
```

To run linter type:
```sh
yarn lint
```
## License
Universal Login SDK is released under the [MIT License](https://opensource.org/licenses/MIT).


## Roadmap
* New matcher: changeBalance (see [#9](https://github.com/EthWorks/Waffle/issues/9))
* Faster testing with native geth (aside from ganache)
* Faster compilation with native and dockerized solc (aside from solcjs)
* Documentation
* Debugging and profiling
