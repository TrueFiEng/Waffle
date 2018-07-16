# Ethereum Waffle
Sweeter and simpler than truffle. Taste best with web3js, chai and ES6.

## Features:
* Build and test contracts
* Deploy and link contracts
* Easy matchers
* No need to run mock rpc server

## Philosophy
* Simplicity over complexity
* Lib (toolbox) rather than framework 
* Explicite over implicte (no magic!)
* Easy to customize

## Using:
```sh
yarn add ethereum-waffle
```

### First test
```js
import createWeb3 from 'ethereum-waffle';
import aContractJson from '../build/aContract.json';

describe('A contract', () => {
  let web3;
  let from;  
  let aContract;

  beforeEach(async () => {
    web3 = createWeb3();
    [from] = await web3.eth.getAccounts();
    aContract = await deployContract(aContractJson);
  });
  
  it("Should add and emit event", async () => {
    expect(await aContract.methods.transfer().send({from})).to.emitEvent('Transfered').withParams(...);
  });
}
```

Run tests:
```sh
yarn waffle:test
```
