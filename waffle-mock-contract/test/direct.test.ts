import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MockProvider} from '@ethereum-waffle/provider';
import {waffleChai} from '@ethereum-waffle/chai';

import {deployMockContract} from '../src';
import Counter from './helpers/interfaces/Counter.json';
import {utils} from 'ethers';

use(chaiAsPromised);
use(waffleChai);

describe('Mock Contract - Integration (called directly)', () => {
  const [wallet] = new MockProvider().getWallets();

  it('throws readable error if mock was not set up for a method', async () => {
    const mockCounter = await deployMockContract(wallet, Counter.interface);

    await expect(mockCounter.read()).to.be.revertedWith('Mock on the method is not initialized');
  });

  it('mocking returned values', async () => {
    const mockCounter = await deployMockContract(wallet, Counter.interface);
    await mockCounter.mock.read.returns(45291);

    expect(await mockCounter.read()).to.equal(45291);
  });

  it('mocking revert', async () => {
    const mockCounter = await deployMockContract(wallet, Counter.interface);
    await mockCounter.mock.read.reverts();

    await expect(mockCounter.read()).to.be.revertedWith('Mock revert');
  });

  it('mock with call arguments', async () => {
    const mockCounter = await deployMockContract(wallet, Counter.interface);
    await mockCounter.mock.add.returns(1);
    await mockCounter.mock.add.withArgs(1).returns(2);
    await mockCounter.mock.add.withArgs(2).reverts();

    expect(await mockCounter.add(0)).to.equal(1);
    expect(await mockCounter.add(1)).to.equal(2);
    await expect(mockCounter.add(2)).to.be.revertedWith('Mock revert');
    expect(await mockCounter.add(3)).to.equal(1);
  });

  describe('Call history', () => {
    it('history is empty when contract was not called', async () => {
      const mockCounter = await deployMockContract(wallet, Counter.interface);

      expect(mockCounter.mock.add.callHistory()).to.deep.equal([]);
      expect(mockCounter.mock.read.callHistory()).to.deep.equal([]);
    });

    it('returns array of empty arrays when call function has no parameters', async () => {
      const mockCounter = await deployMockContract(wallet, Counter.interface);

      await mockCounter.mock.read.returns(45291);
      await mockCounter.read();
      await mockCounter.read();

      expect(mockCounter.mock.read.callHistory()).to.deep.equal([[], []]);
      expect(mockCounter.mock.add.callHistory()).to.deep.equal([]);
    });

    it('returns call arguments when they exist', async () => {
      const mockCounter = await deployMockContract(wallet, Counter.interface);

      await mockCounter.mock.add.returns(45291);
      await mockCounter.add(5);
      await mockCounter.add(42);

      expect(mockCounter.mock.add.callHistory()).to.deep.equal([[new utils.BigNumber(5)], [new utils.BigNumber(42)]]);
      expect(mockCounter.mock.read.callHistory()).to.deep.equal([]);
    });

    it('works for large amount of calls', async () => {
      const last = <T>(list: T[]) => list[list.length - 1];
      const mockCounter = await deployMockContract(wallet, Counter.interface);

      await mockCounter.mock.add.returns(12345);
      for (let i = 0; i < 100; i++) {
        await mockCounter.add(i);
        expect(last(mockCounter.mock.add.callHistory())[0]).to.equal(i);
      }
    });

    it('when different methods were called, does not mix arguments', async () => {
      const mockCounter = await deployMockContract(wallet, Counter.interface);

      await mockCounter.mock.add.returns(1);
      await mockCounter.mock.read.returns(2);
      await mockCounter.add(5);
      await mockCounter.read();

      expect(mockCounter.mock.add.callHistory()).to.deep.equal([[new utils.BigNumber(5)]]);
      expect(mockCounter.mock.read.callHistory()).to.deep.equal([[]]);
    });

    it('supports different kinds of arguments', async () => {
      const mockCounter = await deployMockContract(wallet, Counter.interface);

      await mockCounter.mock.testArgumentTypes.returns('0xc0ffee');
      await mockCounter.testArgumentTypes(42, true, 'hello', '0x123');

      expect(mockCounter.mock.testArgumentTypes.callHistory()).to.deep.equal([
        [new utils.BigNumber(42), true, 'hello', '0x0123']
      ]);
    });
  });
});
