[![Build Status](https://travis-ci.com/EthWorks/Waffle.svg?token=xjj4U84eSFwEsYLTc5Qe&branch=master)](https://travis-ci.com/EthWorks/Waffle)

# Ethereum Waffle
Sweeter and simpler than [truffle](https://github.com/trufflesuite/truffle). Works with [ethers-js](https://github.com/ethers-io/ethers.js/). Taste best with chai and ES6.

## Philosophy
* Simpler: Set of helpers rather than framework
* Sweeter: Easy to customize and extend

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

### Example test
Waffle is test suite agnostic. Here is example test written using mocha:

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
    const actualBalance = await token.balanceOf(wallet.address);
    expect(actualBalance.eq(1000)).to.be.true;
  });  

  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo.address, 7);
    const toBalance = await token.balanceOf(walletTo.address);
    expect(toBalance.eq(7)).to.be.true;
  });

  it('Transfer emits event', async () => {
    expect(token.transfer(walletTo.address, 7)).to.emit(token, 'Transfer');
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
