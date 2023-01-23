import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {deployMockContract} from '../src';

import counterContract from './helpers/interfaces/Counter.json';
import proxyContract from './helpers/interfaces/Proxy.json';

use(chaiAsPromised);

describe('Mock contract chaining behaviour', () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();

  it('chaining return values', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);

    await mockCounter.mock.increment.returns(1).returns(2).returns(3);

    expect(await mockCounter.callStatic.increment()).to.eq(1);
    await mockCounter.increment();
    expect(await mockCounter.callStatic.increment()).to.eq(2);
    await mockCounter.increment();
    expect(await mockCounter.callStatic.increment()).to.eq(3);
  });

  it('chaining reverts', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);

    await mockCounter.mock.increment.returns(1).returns(2).reverts();

    expect(await mockCounter.callStatic.increment()).to.eq(1);
    await mockCounter.increment();
    expect(await mockCounter.callStatic.increment()).to.eq(2);
    await mockCounter.increment();
    await expect(mockCounter.increment()).to.be.reverted;
  });

  it('chaining reverts with reason', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);

    await mockCounter.mock.increment.returns(1).returns(2).revertsWithReason('reason');

    expect(await mockCounter.callStatic.increment()).to.eq(1);
    await mockCounter.increment();
    expect(await mockCounter.callStatic.increment()).to.eq(2);
    await mockCounter.increment();
    await expect(mockCounter.increment()).to.be.revertedWith('reason');
  });

  it('the last return value is used for all subsequent calls', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);

    await mockCounter.mock.increment.returns(1).returns(2);

    expect(await mockCounter.callStatic.increment()).to.eq(1);
    await mockCounter.increment();
    expect(await mockCounter.callStatic.increment()).to.eq(2);
    await mockCounter.increment();
    expect(await mockCounter.callStatic.increment()).to.eq(2);
  });

  it('revert has to be the last call', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);

    expect(() => { return mockCounter.mock.increment.reverts().returns(1); }).to.throw('Revert must be the last call');

    expect(() => { return mockCounter.mock.increment.returns(1).reverts(); }).to.not.throw();
  });

  it('withArgs can be called only once', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);

    expect(() => { return mockCounter.mock.increaseBy.returns(1).withArgs(1).withArgs(2); })
      .to.throw('withArgs can be called only once');
  });

  it('return chaining with withArgs', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);

    await mockCounter.mock.increaseBy.withArgs(1).returns(1).returns(2);
    await mockCounter.mock.increaseBy.withArgs(2).returns(3).returns(4);

    expect(await mockCounter.callStatic.increaseBy(1)).to.eq(1);
    await mockCounter.increaseBy(1);
    expect(await mockCounter.callStatic.increaseBy(1)).to.eq(2);
    await mockCounter.increaseBy(1);
    expect(await mockCounter.callStatic.increaseBy(1)).to.eq(2);

    expect(await mockCounter.callStatic.increaseBy(2)).to.eq(3);
    await mockCounter.increaseBy(2);
    expect(await mockCounter.callStatic.increaseBy(2)).to.eq(4);
    await mockCounter.increaseBy(2);
    expect(await mockCounter.callStatic.increaseBy(2)).to.eq(4);
  });

  it('double call in one transaction', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);
    const proxyFactory = new ContractFactory(proxyContract.abi, proxyContract.bytecode, wallet);
    const proxy = await proxyFactory.deploy(mockCounter.address);

    await mockCounter.mock.increment.returns(1).returns(2);

    expect(await proxy.callStatic.incrementTwice()).to.eq(1 + 2);

    await mockCounter.mock.increaseBy.returns(3).returns(4);

    expect(await proxy.callStatic.increaseByTwice(1)).to.eq(3 + 4);
  });

  it('queue overwrite', async () => {
    const mockCounter = await deployMockContract(wallet, counterContract.abi);

    await mockCounter.mock.increment.returns(1).returns(2);
    await mockCounter.mock.increment.returns(3).returns(4);

    expect(await mockCounter.callStatic.increment()).to.eq(3);
    await mockCounter.increment();
    expect(await mockCounter.callStatic.increment()).to.eq(4);
    await mockCounter.increment();
    expect(await mockCounter.callStatic.increment()).to.eq(4);
  });
});
