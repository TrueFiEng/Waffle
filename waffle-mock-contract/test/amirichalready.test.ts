import {use, expect} from 'chai';
import {Contract, ContractFactory, utils, Wallet} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';
import {waffleChai} from '@ethereum-waffle/chai';
import {deployMockContract} from '../src';

import IERC20 from './helpers/interfaces/IERC20.json';
import AmIRichAlready from './helpers/interfaces/AmIRichAlready.json';

use(waffleChai);

describe('Am I Rich Already', () => {
  let contractFactory: ContractFactory;
  let sender: Wallet;
  let receiver: Wallet;
  let mockERC20: Contract;
  let contract: Contract;

  beforeEach(async () => {
    [sender, receiver] = new MockProvider().getWallets();
    mockERC20 = await deployMockContract(sender, IERC20.abi);
    contractFactory = new ContractFactory(AmIRichAlready.abi, AmIRichAlready.bytecode, sender);
    contract = await contractFactory.deploy(mockERC20.address);
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
    await mockERC20.mock.balanceOf.withArgs(sender.address).returns(utils.parseEther('1000001'));

    expect(await contract.check()).to.equal(true);
    expect(await contract.connect(receiver.address).check()).to.equal(false);
  });
});
