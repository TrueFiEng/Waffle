![Ethereum Waffle](https://raw.githubusercontent.com/EthWorks/Waffle/master/docs/source/logo.png)

[![CircleCI](https://circleci.com/gh/EthWorks/Waffle.svg?style=svg)](https://circleci.com/gh/EthWorks/Waffle)
[![](https://img.shields.io/npm/v/@ethereum-waffle/doppelganger.svg)](https://www.npmjs.com/package/@ethereum-waffle/doppelganger)

_doppelgänger /ˈdɒp(ə)lˌɡaŋə,ˈdɒp(ə)lˌɡɛŋə/ - an apparition or double of a living person_

# @ethereum-waffle/doppelganger

Library for mocking smart contract dependencies during unit testing.

## Installation
In the current version of waffle (v2.x.x) you will install this package as a dependency of the main waffle package - `ethereum-waffle`.

```
yarn add --dev ethereum-waffle
npm install --save-dev ethereum-waffle
```

If you want to use this package directly please install it via:
```
yarn add --dev @ethereum-waffle/doppelganger
npm install --save-dev @ethereum-waffle/doppelganger
```

## Usage

Create a instance of fake contract providing the ABI/interface of the smart contract you want to mock:

```js
import {doppelganger} from '@ethereum-waffle/doppelganger';

...

const mockContract = await doppelganger(wallet, contractAbi);
```

Doppelganger can now be passed into other contracts by using the `address` attribute.

Return values for mocked functions can be set using:

```js
await doppelganger.<nameOfMethod>.returns(<value>)
```

## Example

Below example illustrates how Doppelganger can be used to test the very simple `AmIRichAlready` contract.

```Solidity
pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract AmIRichAlready {
    IERC20 private tokenContract;
    address private wallet;
    uint private constant RICHNESS = 1000000 * 10 ** 18;

    constructor (IERC20 _tokenContract) public {
        tokenContract = _tokenContract;
        wallet = msg.sender;
    }

    function check() public view returns(bool) {
        uint balance = tokenContract.balanceOf(wallet);
        return balance > RICHNESS;
    }
}
```

We are mostly interested in the `tokenContract.balanceOf` call. Doppelganger will be used to mock exactly this call with values that are significant for the return of the `check()` method.

```js
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ethers from 'ethers';
import {MockProvider, deployContract} from 'ethereum-waffle';
import Doppelganger from 'ethereum-doppelganger';

import IERC20 from '../../build/IERC20';
import AmIRichAlready from '../../build/AmIRichAlready';

chai.use(chaiAsPromised);

describe('Am I Rich Already?', () => {
  const [user] = new MockProvider().getWallets();
  let contract; // an instance of the AmIRichAlready contract
  let mockERC20; // an instance of doppelganger for the ERC20 token we want to observe

  beforeEach(async () => {
    mockERC20 = await doppelganger(user, IERC20.abi); // tell doppelganger what it should pretend to be
    contract = await deployContract(user, AmIRichAlready, [mockERC20.address]); // deploy the contract under test to the chain
  });

  describe('check method', () => {
    it('returns false if the wallet has less then 1000000 DAI', async () => {
      await mockERC20.balanceOf.returns(ethers.utils.parseEther('999999')); // configure doppelganger to return 999999 when balanceOf is called
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(false);
    });

    it('returns false if the wallet has exactly 1000000 DAI', async () => {
      await mockERC20.balanceOf.returns(ethers.utils.parseEther('1000000')); // subsequent calls override the previous config
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(false);
    });

    it('returns true if the wallet has more then 1000000 DAI', async () => {
      await mockERC20.balanceOf.returns(ethers.utils.parseEther('1000001'));
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(true);
    });
  });
});
```
