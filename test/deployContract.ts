import {expect, use} from 'chai';
import {
  deployContract,
  createMockProvider,
  getWallets,
  solidity
} from '../lib/waffle';
import SafeMath from './example/build/SafeMath.json';
import { ContractFactory } from 'ethers';

use(solidity);

describe('deployContract', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);

  it('deploys contracts', async () => {
    const contract = await deployContract(wallet, SafeMath);
    expect(contract.address).to.be.properAddress;
  });

  it('uses ContractFactory.deploy', async () => {
    const originalDeploy = ContractFactory.prototype.deploy;
    let called = false;
    ContractFactory.prototype.deploy = function (...args: any[]) {
      called = true;
      ContractFactory.prototype.deploy = originalDeploy;
      return originalDeploy.apply(this, args);
    };

    await deployContract(
      wallet,
      SafeMath
    );
    expect(called).to.be.true;
  });
});
