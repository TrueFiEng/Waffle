import {expect, use} from 'chai';
import {Contract, utils, Wallet} from 'ethers';
import {deployContract, deployMockContract, MockProvider, solidity} from 'ethereum-waffle';

import IERC20 from '../build/IERC20.json';
import AmIRichAlready from '../build/AmIRichAlready.json';

use(solidity);

describe('Am I Rich Already', () => {
  let mockERC20: Contract;
  let contract: Contract;
  let wallet: Wallet;

  beforeEach(async () => {
    [wallet] = new MockProvider().getWallets();
    mockERC20 = await deployMockContract(wallet, IERC20.abi);
    contract = await deployContract(wallet, AmIRichAlready, [mockERC20.address]);
  });

  it('checks if contract called balanceOf with certain wallet on the ERC20 token', async () => {
    await mockERC20.mock.balanceOf
      .withArgs(wallet.address)
      .returns(utils.parseEther('999999'));
    await contract.check();
    expect('balanceOf').to.be.calledOnContractWith(mockERC20, [wallet.address]);
  });

  it('returns false if the wallet has less than 1000000 coins', async () => {
    await mockERC20.mock.balanceOf
      .withArgs(wallet.address)
      .returns(utils.parseEther('999999'));
    expect(await contract.check()).to.be.equal(false);
  });

  it('returns true if the wallet has at least 1000000 coins', async () => {
    await mockERC20.mock.balanceOf
      .withArgs(wallet.address)
      .returns(utils.parseEther('1000000'));
    expect(await contract.check()).to.be.equal(false);
  });
});
