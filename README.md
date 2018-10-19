[![Build Status](https://travis-ci.com/EthWorks/Waffle.svg?token=xjj4U84eSFwEsYLTc5Qe&branch=master)](https://travis-ci.com/EthWorks/Waffle)

![Ethereum Waffle](https://raw.githubusercontent.com/EthWorks/Waffle/master/docs/images/logo.png)

Library for writing and testing smart contracts.

Sweeter and simpler than [truffle](https://github.com/trufflesuite/truffle).

Works with [ethers-js](https://github.com/ethers-io/ethers.js/). Tastes best with ES6.

## Philosophy
* __Simpler__: minimalistic, a couple of helpers, matchers and tasks rather than a framework, few dependencies.
* __Sweeter__: Nice syntax, fast, easy to extend.

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
pragma solidity ^0.4.24;

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

## Features walkthrough

### Import contracts from npms
Import solidity files from solidity files form npm modules that you added to your project, e.g:
```
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
```

### Create a mock provider
Create a mock provider (no need to run any tests!) and test your contracts against it, e.g.:
```js
provider = createMockProvider();
```

### Get example wallets
Get wallets you can use to sign transactions:
```js
[wallet, walletTo] = await getWallets(provider);
```

### Deploy contract
Deploy a contract:
```js
token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);
```

### Chai matchers
A set of sweet chai matchers, makes your test easy to write and read. Below couple of examples.

* Testing big numbers:
```js
expect(await token.balanceOf(wallet.address)).to.eq(993);
```
Available matchers for BigNumbers are: `equal`, `eq`, `above`, `below`, `least`, `most`.

* Testing what events where emitted with what arguments:
```js
await expect(token.transfer(walletTo.address, 7))
  .to.emit(token, 'Transfer')
  .withArgs(wallet.address, walletTo.address, 7);
```

* Testing if transaction was reverted:
```js
await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
```

* Testing if transaction was reverted with certain message:
```js
await expect(token.transfer(walletTo.address, 1007)).to.be.revertedWith('Insufficient funds');
```


* Testing if string is a proper address:
```js
expect('0x28FAA621c3348823D6c6548981a19716bcDc740e').to.be.properAddress;
```

* Testing if string is a proper secret:
```js
expect('0x706618637b8ca922f6290ce1ecd4c31247e9ab75cf0530a0ac95c0332173d7c5').to.be.properPrivateKey;
```

* Testing if string is a proper hex value of given length:
```js
expect('0x70').to.be.properHex(2);
```

## Roadmap

* New matcher: changeBalance (see [#9](https://github.com/EthWorks/Waffle/issues/9))
* Faster testing with parallelization
* Faster compilation with incremental compilation
* Documentation
* Debugging
