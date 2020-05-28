import {expect, use} from 'chai';
import {Contract, utils} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';

import BasicToken from '../build/BasicToken.json';
import AmIRichAlready from '../build/AmIRichAlready.json';

use(solidity);

describe('Am I Rich Already', () => {
  let ERC20: Contract;
  let contract: Contract;
  const [wallet] = new MockProvider().getWallets();

  it('returns false if the wallet has less then 1000000 coins', async () => {
    ERC20 = await deployContract(wallet, BasicToken, [utils.parseEther('999999')]);
    contract = await deployContract(wallet, AmIRichAlready, [ERC20.address]);
    expect(await contract.check()).to.be.equal(false);
    expect('balanceOf').to.be.calledOnContract(ERC20);
  });

  it('returns true if the wallet has at least 1000000 coins', async () => {
    ERC20 = await deployContract(wallet, BasicToken, [utils.parseEther('1000001')]);
    contract = await deployContract(wallet, AmIRichAlready, [ERC20.address]);
    expect(await contract.check()).to.equal(true);
    expect('balanceOf').to.be.calledOnContractWith(ERC20, [wallet.address]);
  });
});
