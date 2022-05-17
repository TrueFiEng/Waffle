import {use, expect} from 'chai';
import {utils, Contract} from 'ethers';
import {deployMockContract, MockProvider, solidity, deployContract} from 'ethereum-waffle';

import IERC20 from '../build/IERC20.json';
import AmIRichAlready from '../build/AmIRichAlready.json';

use(solidity);

describe('Am I Rich Already', () => {
  let mockERC20: Contract;
  let contract: Contract;
  const [wallet, otherWallet] = new MockProvider().getWallets();

  beforeEach(async () => {
    mockERC20 = await deployMockContract(wallet, IERC20.abi);
    contract = await deployContract(wallet, AmIRichAlready, [mockERC20.address]);
  });

  it('returns false if the wallet has less then 1000000 coins', async () => {
    await mockERC20.mock.balanceOf.returns(utils.parseEther('999999'));
    expect(await contract.check()).to.be.equal(false);
  });

  it('returns true if the wallet has more than 1000000 coins', async () => {
    await mockERC20.mock.balanceOf.returns(utils.parseEther('1000001'));
    expect(await contract.check()).to.equal(true);
  });

  it('reverts if the ERC20 reverts', async () => {
    await mockERC20.mock.balanceOf.reverts();
    await expect(contract.check()).to.be.revertedWith('Mock revert');
  });

  it('returns 1000001 coins for my address and 0 otherwise', async () => {
    await mockERC20.mock.balanceOf.returns('0');
    await mockERC20.mock.balanceOf.withArgs(wallet.address).returns(utils.parseEther('1000001'));

    expect(await contract.check()).to.equal(true);
    expect(await contract.connect(otherWallet.address).check()).to.equal(false);
  });
});
