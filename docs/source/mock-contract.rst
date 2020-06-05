Mock contract
=============

Mocking your smart contract dependencies.

Usage
-----
.. tabs::

  .. group-tab:: Waffle 3.0.0

    Create an instance of a mock contract providing the :code:`ABI` of the smart contract you want to mock:

  .. group-tab:: Waffle 2.5.0

    Create an instance of a mock contract providing the :code:`ABI/interface` of the smart contract you want to mock:

.. code-block:: ts

  import {deployMockContract} from '@ethereum-waffle/mock-contract';

  ...

  const mockContract = await deployMockContract(wallet, contractAbi);

Mock contract can now be passed into other contracts by using the :code:`address` attribute.
Return values for mocked functions can be set using:

.. code-block:: ts

  await mockContract.mock.<nameOfMethod>.returns(<value>)
  await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).returns(<value>)

Methods can also be set up to be reverted using:

.. code-block:: ts

  await mockContract.mock.<nameOfMethod>.reverts()
  await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).reverts()

Example
-------

The example below illustrates how :code:`mock-contract` can be used to test the very simple :code:`AmIRichAlready` contract.

.. code-block:: solidity

  pragma solidity ^0.6.0;

  interface IERC20 {
      function balanceOf(address account) external view returns (uint256);
  }

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


We are mostly interested in the :code:`tokenContract.balanceOf` call.
Mock contract will be used to mock exactly this call with values that are significant for the return of the :code:`check()` method.

.. code-block:: ts

  const {use, expect} = require('chai');
  const {ContractFactory, utils} = require('ethers');
  const {MockProvider} = require('@ethereum-waffle/provider');
  const {waffleChai} = require('@ethereum-waffle/chai');
  const {deployMockContract} = require('@ethereum-waffle/mock-contract');

  const IERC20 = require('../build/IERC20');
  const AmIRichAlready = require('../build/AmIRichAlready');

  use(waffleChai);

  describe('Am I Rich Already', () => {
    async function setup() {
      const [sender, receiver] = new MockProvider().getWallets();
      const mockERC20 = await deployMockContract(sender, IERC20.abi);
      const contractFactory = new ContractFactory(AmIRichAlready.abi, AmIRichAlready.bytecode, sender);
      const contract = await contractFactory.deploy(mockERC20.address);
      return {sender, receiver, contract, mockERC20};
    }

    it('returns false if the wallet has less then 1000000 coins', async () => {
      const {contract, mockERC20} = await setup();
      await mockERC20.mock.balanceOf.returns(utils.parseEther('999999'));
      expect(await contract.check()).to.be.equal(false);
    });

    it('returns true if the wallet has at least 1000000 coins', async () => {
      const {contract, mockERC20} = await setup();
      await mockERC20.mock.balanceOf.returns(utils.parseEther('1000001'));
      expect(await contract.check()).to.equal(true);
    });

    it('reverts if the ERC20 reverts', async () => {
      const {contract, mockERC20} = await setup();
      await mockERC20.mock.balanceOf.reverts();
      await expect(contract.check()).to.be.revertedWith('Mock revert');
    });

    it('returns 1000001 coins for my address and 0 otherwise', async () => {
      const {contract, mockERC20, sender, receiver} = await setup();
      await mockERC20.mock.balanceOf.returns('0');
      await mockERC20.mock.balanceOf.withArgs(sender.address).returns(utils.parseEther('1000001'));

      expect(await contract.check()).to.equal(true);
      expect(await contract.connect(receiver.address).check()).to.equal(false);
    });
  });
