import {expect} from 'chai';
import {deployContract, createMockProvider, getWallets} from '../lib';
import {ContractFactory} from 'ethers';
import SafeMath from './example/build/SafeMath.json';

describe('deployContract', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);

  it('cannot deploys contract without bytecode', async () => {
    const contractJson = {abi: '0x', evm: {bytecode: {object: ''}}};
    await expect(deployContract(wallet, contractJson)).to.be.rejectedWith('Cannot deploy contract with empty bytecode');
  });

  it('cannot deploys contract without bytecode - simplified json', async () => {
    const contractJson = {abi: ['0x'], bytecode: ''};
    await expect(deployContract(wallet, contractJson)).to.be.rejectedWith('Cannot deploy contract with empty bytecode');
  });

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
