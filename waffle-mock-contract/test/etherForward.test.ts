import {waffleChai} from '@ethereum-waffle/chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {expect, use} from 'chai';
import {Contract, ContractFactory, Wallet} from 'ethers';
import {deployMockContract} from '../src';

import EtherForward from './helpers/interfaces/EtherForward.json';
import IERC20 from './helpers/interfaces/IERC20.json';

use(waffleChai);

describe('Ether Forwarded', () => {
  let contractFactory: ContractFactory;
  let sender: Wallet;
  let mockERC20: Contract;
  let contract: Contract;
  let provider: MockProvider;

  beforeEach(async () => {
    provider = new MockProvider()
    ;[sender] = provider.getWallets();
    mockERC20 = await deployMockContract(sender, IERC20.abi);
    contractFactory = new ContractFactory(EtherForward.abi, EtherForward.bytecode, sender);
    contract = await contractFactory.deploy(mockERC20.address);
  });

  it('Can forward ether through call', async () => {
    expect(await provider.getBalance(mockERC20.address)).to.be.equal(0);
    await contract.forwardByCall({value: 7});
    expect(await provider.getBalance(mockERC20.address)).to.be.equal(7);
  });

  it('Can forward ether through send', async () => {
    expect(await provider.getBalance(mockERC20.address)).to.be.equal(0);
    await contract.forwardBySend({value: 7});
    expect(await provider.getBalance(mockERC20.address)).to.be.equal(7);
  });

  it('Can forward ether through transfer', async () => {
    expect(await provider.getBalance(mockERC20.address)).to.be.equal(0);
    await contract.forwardByTransfer({value: 7});
    expect(await provider.getBalance(mockERC20.address)).to.be.equal(7);
  });

  it('Can mock a revert on a receive function', async () => {
    expect(await provider.getBalance(mockERC20.address)).to.be.equal(0);

    await mockERC20.mock.receive.revertsWithReason('Receive function rejected ether.');

    await expect(
      contract.forwardByCall({value: 7})
    ).to.be.revertedWith('Receive function rejected ether.');

    await expect(
      contract.forwardBySend({value: 7})
    ).to.be.revertedWith('forwardBySend failed');

    await expect(
      contract.forwardByTransfer({value: 7})
    ).to.be.reverted;

    expect(await provider.getBalance(mockERC20.address)).to.be.equal(0);
  });
});
