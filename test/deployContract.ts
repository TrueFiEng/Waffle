import {expect} from 'chai';
import {deployContract, createMockProvider, getWallets} from '../lib/waffle';
import {ContractFactory} from 'ethers';
import SafeMath from './example/build/SafeMath.json';

describe('deployContract', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);

  it('deploys contracts', async () => {
    const contract = await deployContract(wallet, SafeMath);
    expect(contract.address).to.be.properAddress;
  });

  it('accepts simplified json', async () => {
    const simplified = {
      abi: SafeMath.abi,
      bytecode: SafeMath.evm.bytecode.object
    };
    const contract = await deployContract(wallet, simplified);
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
