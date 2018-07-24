# Ethereum Waffle
Sweeter and simpler than [truffle](https://github.com/trufflesuite/truffle). Works with [web3js](https://web3js.readthedocs.io/en/1.0/). Taste best with chai and ES6.

## Our philosophy
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

### First test

```js
import createWeb3 from 'ethereum-waffle';
import StandardToken from '../build/StandardToken.json';

describe('StandardToken', () => {
  const amount = 100;
  let web3;
  let accounts;
  let token;
  let to;
  let from;

  beforeEach(async () => {
    {web3, [from]} = createWeb3();
    token = await deployContract(StandardTokenMock.new(account[0], amount));
  });
  
  it("Should transfer", async () => {
    const [from] = accounts;
    await token.methods.transfer(to, amount).send({from});

    expect(await token.balanceOf(from)).to.eq('0');
    expect(await token.balanceOf(to)).to.eq('0');
     const recipientBalance = await this.token.balanceOf(to);
     assert.equal(recipientBalance, amount);

    expect(await aContract.methods.transfer().send({from})).to.emitEvent('Transfered').withParams(...);
  });
  
  it("Transfer should emit event", async () => {
    expect(token.methods.transfer(to, amount).send({from})).to
      .to.emitEvent('Transfered')
      .withParams(from, to, amount);
  });
}
```

Run tests:
```sh
yarn waffle:test
```
