[![Build Status](https://travis-ci.com/EthWorks/Waffle.svg?token=xjj4U84eSFwEsYLTc5Qe&branch=master)](https://travis-ci.com/EthWorks/Waffle)

# Ethereum Waffle
Tool for writing and testing smart contracts. Sweeter and simpler than [truffle](https://github.com/trufflesuite/truffle). Works with [ethers-js](https://github.com/ethers-io/ethers.js/). Taste best with ES6.

## Philosophy
* Simpler: Minimalistic: a couple of helpers, matchers and tasks rather than a framework, just two dependencies (ethers.js and solc).
* Sweeter: Nice syntax, fast, easy to extend.
s
## Features:
* Build, deploy link and test solidity based smart contracts
* No need to run mock rpc server
* Easily import contracts from other npms
* Coming soon: Parallel testing

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

### Compiling contracts

To compile you contracts simply type:
```sh
npx waffle
```

Waffle expects your contracts are in `contracts` directory.  The output will be saved in the `build` directory.

### Adding a task
For convince, you can add a task to your `package.json`. In the sections `scripts`, add following line:
```json
  "build": "waffle"
```

Now you can build you contracts with:
```sh
yarn build
```

### Example contract and test
Here is example contract written in Solidity (to be placed in `contracts` directory of the project):
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

Here is example test written with Waffle (to be placed in `test` directory of the project):

```js
import chai from 'chai';
import {createMockProvider, deployContract, getWallets} from '../../lib/waffle';
import BasicTokenMock from './build/BasicTokenMock';
import solidity from '../../lib/matchers';

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

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  });
});
```

To run test type in the console:
```sh
mocha
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

## Configuring