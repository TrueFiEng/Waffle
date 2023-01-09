import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MockProvider} from '@ethereum-waffle/provider';
import {waffleChai} from '@ethereum-waffle/chai';
import {ContractFactory, Wallet} from 'ethers';

import {deployMockContract} from '../src';
import Counter from './helpers/interfaces/Counter.json';

import DoppelGangerContract from '../src/Doppelganger.json'

export function mockContractDirectTest(provider: MockProvider){
  use(chaiAsPromised);
  use(waffleChai);
  
  describe('Mock Contract - Integration (called directly)', () => {
    const [wallet] = provider.getWallets();
  
    it('throws readable error if mock was not set up for a method', async () => {
      const address = Wallet.createRandom().address;
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
  
      await expect(mockCounter.read()).to.be.revertedWith('Mock on the method is not initialized');
    });
  
    it('mocking returned values', async () => {
      const address = Wallet.createRandom().address;
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
      await mockCounter.mock.read.returns(45291);
  
      expect(await mockCounter.read()).to.equal(45291);
    });
  
    it('mocking revert', async () => {
      const address = Wallet.createRandom().address;
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
      await mockCounter.mock.read.reverts();
  
      await expect(mockCounter.read()).to.be.revertedWith('Mock revert');
    });
  
    it('mock with call arguments', async () => {
      const address = Wallet.createRandom().address;
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
      await mockCounter.mock.add.returns(1);
      await mockCounter.mock.add.withArgs(1).returns(2);
      await mockCounter.mock.add.withArgs(2).reverts();
  
      expect(await mockCounter.add(0)).to.equal(1);
      expect(await mockCounter.add(1)).to.equal(2);
      await expect(mockCounter.add(2)).to.be.revertedWith('Mock revert');
      expect(await mockCounter.add(3)).to.equal(1);
    });
  
    it('should be able to call to another contract', async () => {
      const address = Wallet.createRandom().address;
      const counterFactory = new ContractFactory(Counter.abi, Counter.bytecode, wallet);
      const counter = await counterFactory.deploy();
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
  
      expect(await mockCounter.staticcall(counter, 'read()')).to.equal('0');
      expect(await mockCounter.staticcall(counter, 'read')).to.equal('0');
    });
  
    it('should be able to call another contract with a parameter', async () => {
      const address = Wallet.createRandom().address;
      const counterFactory = new ContractFactory(Counter.abi, Counter.bytecode, wallet);
      const counter = await counterFactory.deploy();
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
  
      expect(await mockCounter.staticcall(counter, 'add', 1)).to.equal('1');
    });
  
    it('should be able to call another contract with many parameters', async () => {
      const address = Wallet.createRandom().address;
      const counterFactory = new ContractFactory(Counter.abi, Counter.bytecode, wallet);
      const counter = await counterFactory.deploy();
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
  
      expect(await mockCounter.staticcall(counter, 'addThree', 1, 2, 3)).to.equal('6');
    });
  
    it('should be able to execute another contract', async () => {
      const address = Wallet.createRandom().address;
      const counterFactory = new ContractFactory(Counter.abi, Counter.bytecode, wallet);
      const counter = await counterFactory.deploy();
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
  
      await mockCounter.call(counter, 'increment()');
      expect(await counter.read()).to.equal('1');
  
      await mockCounter.call(counter, 'increment');
      expect(await counter.read()).to.equal('2');
    });
  
    it('should be able to execute another contract with a parameter', async () => {
      const address = Wallet.createRandom().address;
      const counterFactory = new ContractFactory(Counter.abi, Counter.bytecode, wallet);
      const counter = await counterFactory.deploy();
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
  
      await mockCounter.call(counter, 'increaseBy', 2);
      expect(await counter.read()).to.equal('2');
    });
  
    it('should be able to execute another contract with many parameters', async () => {
      const address = Wallet.createRandom().address;
      const counterFactory = new ContractFactory(Counter.abi, Counter.bytecode, wallet);
      const counter = await counterFactory.deploy();
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
  
      await mockCounter.call(counter, 'increaseByThreeValues', 1, 2, 3);
      expect(await counter.read()).to.equal('6');
    });
  
    it('can be deployed under specified address', async () => {
      const address = Wallet.createRandom().address;
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
      expect(mockCounter.address).to.eq(address);
      expect(await provider.getCode(address)).to.eq('0x'+DoppelGangerContract.evm.deployedBytecode.object);
    });
  
    it(`can't be deployed twice under the same address`, async () => {
      const address = Wallet.createRandom().address;
      const mockCounter = await deployMockContract(wallet, Counter.abi, address);
      await expect(deployMockContract(wallet, Counter.abi, address)).to.eventually.rejectedWith(
        Error, 
        `${address} already contains a contract`
      );
    });
  });
}