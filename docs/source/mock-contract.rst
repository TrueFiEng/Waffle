Mock contract
=============

Mocking your smart contract dependencies.

Usage
-----

Create an instance of a mock contract providing the :code:`ABI` of the smart contract you want to mock:

.. code-block:: ts

  import {deployMockContract} from '@ethereum-waffle/mock-contract';

  ...

  const mockContract = await deployMockContract(wallet, contractAbi);

You can also choose the deployment address of the mock contract with the options argument:

.. code-block:: ts

  const mockContract = await deployMockContract(wallet, contractAbi, {
    address: deploymentAddress, 
    overrride: false // optional, specifies if the contract should be overwritten
  })

The mock contract can now be integrated into other contracts by using the :code:`address` attribute.
Return values for mocked functions can be set using:

.. code-block:: ts

  await mockContract.mock.<nameOfMethod>.returns(<value>)
  await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).returns(<value>)

Methods can also be set up to be reverted using:

.. code-block:: ts

  await mockContract.mock.<nameOfMethod>.reverts()
  await mockContract.mock.<nameOfMethod>.revertsWithReason(<reason>)
  await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).reverts()
  await mockContract.mock.<nameOfMethod>.withArgs(<arguments>).revertsWithReason(<reason>)

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
Mock contract will be used to mock exactly this call with values that are relevant for the return of the :code:`check()` method.

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

    it('returns true if the wallet has more than 1000000 coins', async () => {
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

Mocking multiple calls
----------------------

Mock contract allows to queue multiple mock calls to the same function. This can only be done if the function is not pure or view. That's because the mock call queue is stored on the blockchain and we need to modify it.

.. code-block:: ts

  await mockContract.mock.<nameOfMethod>.returns(<value1>).returns(<value2>);

  await mockContract.<nameOfMethod>() // returns <value1>
  await mockContract.<nameOfMethod>() // returns <value2>

Just like with regular mock calls, the queue can be set up to revert or return a specified value. It can also be set up to return different values for different arguments.

.. code-block:: ts

  await mockContract.mock.<nameOfMethod>.returns(<value1>).returns(<value2>);
  await mockContract.mock.<nameOfMethod>.withArgs(<arguments1>).returns(<value3>);

  await mockContract.<nameOfMethod>() // returns <value1>
  await mockContract.<nameOfMethod>() // returns <value2>
  await mockContract.<nameOfMethod>(<arguments1>) // returns <value3>

Keep in mind that the mocked revert must be at the end of the queue, because it prevents the contract from updating the queue.

.. code-block:: ts

  await mockContract.mock.<nameOfMethod>.returns(<value1>).returns(<value2>).reverts();

  await mockContract.<nameOfMethod>() // returns <value1>
  await mockContract.<nameOfMethod>() // returns <value2>
  await mockContract.<nameOfMethod>() // reverts

When the queue is empty, the mock contract will return the last value from the queue and each time the you set up a new queue, the old one is overwritten.

.. code-block:: ts

  await mockContract.mock.<nameOfMethod>.returns(<value1>).returns(<value2>);

  await mockContract.<nameOfMethod>() // returns <value1>
  await mockContract.<nameOfMethod>() // returns <value2>
  await mockContract.<nameOfMethod>() // returns <value2>

  await mockContract.mock.<nameOfMethod>.returns(<value1>).returns(<value2>);
  await mockContract.mock.<nameOfMethod>.returns(<value3>).returns(<value4>);

  await mockContract.<nameOfMethod>() // returns <value3>
  await mockContract.<nameOfMethod>() // returns <value4>

Mocking receive function
------------------------

The :code:`receive` function of the mocked Smart Contract can be mocked to revert. It cannot however be mocked to return a specified value, because of gas limitations when calling another contract using :code:`send` and :code:`transfer`.

Receive mock example
^^^^^^^^^^^^^^^^^^^^

.. code-block:: solidity

  pragma solidity ^0.6.0;

  interface IERC20 {
      function balanceOf(address account) external view returns (uint256);
      fallback() external payable;
      receive() external payable;
  }

  contract EtherForward {
      IERC20 private tokenContract;

      constructor (IERC20 _tokenContract) public {
          tokenContract = _tokenContract;
      }

      function forward() public payable {
          payable(tokenContract).transfer(msg.value);
      }
  }

.. code-block:: ts

  (...)

  it('use the receive function normally', async () => {
    const {contract, mockERC20} = await setup();

    expect (
      await mockERC20.provider.getBalance(mockERC20.address)
    ).to.be.equal(0);

    await contract.forward({value: 7})

    expect (
      await mockERC20.provider.getBalance(mockERC20.address)
    ).to.be.equal(7);
  });

  it('can mock the receive function to revert', async () => {
    const {contract, mockERC20} = await setup();

    await mockERC20.mock.receive.revertsWithReason('Receive function rejected')

    await expect(
      contract.forward({value: 7})
    ).to.be.revertedWith('Receive function rejected')

    expect (
      await mockERC20.provider.getBalance(mockERC20.address)
    ).to.be.equal(0);
  });

  (...)
