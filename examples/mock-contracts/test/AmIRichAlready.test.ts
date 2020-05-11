<<<<<<< HEAD
import {use, expect} from 'chai';
import {ContractFactory, utils} from 'ethers';
import {deployMockContract, MockProvider, solidity} from 'ethereum-waffle';

import IERC20 from '../build/IERC20.json';
import AmIRichAlready from '../build/AmIRichAlready.json';

use(solidity);

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
=======
import {use, expect} from 'chai';
import {ContractFactory, utils} from 'ethers';
import {deployMockContract, MockProvider, solidity} from 'ethereum-waffle';

import IERC20 from '../build/IERC20.json';
import AmIRichAlready from '../build/AmIRichAlready.json';

use(solidity);

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
>>>>>>> 6509df661491f79f4648caa0f8110e5a9e5a13e3
