# Ethereum Waffle
Sweeter and simpler than truffle. Taste best with web3js, chai and ES6.

## Features:
* Build and test contracts
* Deploy and link contracts
* Easy matchers
* No need to run mock rpc server

## Philosophy
* Clear, simple syntax, utilize ES6 constructions
* Simplicity over complexity
* Lib (toolbox) rather than framework 
* Explicite over implicte (no magic!)
* Easy to customize and extend

## Install:
To start using with npm, type:
```sh
npm i ethereum-waffle
```

or with Yarn:
```sh
yarn add ethereum-waffle
```

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
