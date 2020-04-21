![Ethereum Waffle](https://raw.githubusercontent.com/EthWorks/Waffle/master/docs/source/logo.png)

[![CircleCI](https://circleci.com/gh/EthWorks/Waffle.svg?style=svg)](https://circleci.com/gh/EthWorks/Waffle)
[![](https://img.shields.io/npm/v/@ethereum-waffle/mock-contract.svg)](https://www.npmjs.com/package/@ethereum-waffle/mock-contract)

# @ethereum-waffle/mock-contract

Library for mocking smart contract dependencies during unit testing.

## Warning
@ethereum-waffle/mock-contract is an experimental package. Breaking changes will not result in a new major version.

## Installation
In the current version of waffle (v2.x.x) you will install this package as a dependency of the main waffle package - `ethereum-waffle`.

```
yarn add --dev ethereum-waffle
npm install --save-dev ethereum-waffle
```

If you want to use this package directly please install it via:
```
yarn add --dev @ethereum-waffle/mock-contract
npm install --save-dev @ethereum-waffle/mock-contract
```

## Usage

Create an instance of a mock contract providing the ABI/interface of the smart contract you want to mock:

```js
import {deployMockContract} from '@ethereum-waffle/mock-contract';

...

const mockContract = await deployMockContract(wallet, contractAbi);
```

Mock contract can now be passed into other contracts by using the `address` attribute.

Return values for mocked functions can be set using:

```js
await mockContract.mock.<nameOfMethod>.returns(<value>)
await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).returns(<value>)
```

Methods can also be set up to be reverted using:

```js
await mockContract.mock.<nameOfMethod>.reverts()
await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).reverts()
```

## Example

The example below illustrates how `mock-contract` can be used to test the very simple `AmIRichAlready` contract.

```Solidity
pragma solidity ^0.6.3;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract AmIRichAlready {
    IERC20 private tokenContract;
    uint private constant RICHNESS = 1000000 * 10 ** 18;

    constructor (IERC20 _tokenContract) public {
        tokenContract = _tokenContract;
    }

    function check() public view returns (bool) {
        uint balance = tokenContract.balanceOf(msg.sender);
        return balance > RICHNESS;
    }
}
```

We are mostly interested in the `tokenContract.balanceOf` call. Mock contract will be used to mock exactly this call with values that are significant for the return of the `check()` method.

```js
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ethers from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';
import {waffleChai} from '@ethereum-waffle/chai';
import {deployMockContract} from '@ethereum-waffle/mock-contract';

import IERC20 from '../../build/IERC20';
import AmIRichAlready from '../../build/AmIRichAlready';

chai.use(chaiAsPromised);
chai.use(waffleChai);

describe('Am I Rich Already?', () => {
  const [user, stranger] = new MockProvider().getWallets();
  let contract; // an instance of the AmIRichAlready contract
  let mockERC20; // an instance of a mock contract for the ERC20 token we want to observe

  beforeEach(async () => {
    mockERC20 = await deployMockContract(user, IERC20.abi);
    const contractFactory = new ContractFactory(AmIRichAlready.abi, AmIRichAlready.bytecode, sender)
    contract = await contractFactory.deploy(mockERC20.address);
  });

  describe('check method', () => {
    it('returns false if the wallet has less then 1000000 DAI', async () => {
      // configure mockERC20 to return 999999 when balanceOf is called
      await mockERC20.mock.balanceOf.returns(ethers.utils.parseEther('999999'));
      expect(await contract.check()).to.be.equal(false);
    });

    it('returns false if the wallet has exactly 1000000 DAI', async () => {
      // subsequent calls override the previous config
      await mockERC20.mock.balanceOf.returns(ethers.utils.parseEther('1000000'));
      expect(await contract.check()).to.equal(false);
    });

    it('returns true if the wallet has more then 1000000 DAI', async () => {
      await mockERC20.mock.balanceOf.returns(ethers.utils.parseEther('1000001'));
      expect(await contract.check()).to.equal(true);
    });

    it('reverts for some reason', async () => {
      await mockERC20.mock.balanceOf.reverts();
      await expect(contract.check()).to.be.revertedWith('Mock revert');
    });

    it('returns 1000001 DAI for my address and 0 otherwise', async () => {
        await mockERC20.mock.balanceOf.withArgs(user.address).returns(ethers.utils.parseEther('1000001'));
        // mock without any arguments will be triggered by default
        await mockERC20.mock.balanceOf.returns('0');

        expect(await contract.check()).to.equal(true);
        expect(await contract.attach(stranger).check()).to.equal(false);
    }); 
  });
});
```

# Special thanks

Special thanks to @spherefoundry for creating the original [Doppelganger](https://github.com/EthWorks/Doppelganger) project. 
