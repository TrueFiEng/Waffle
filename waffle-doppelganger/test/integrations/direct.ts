import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MockProvider} from 'ethereum-waffle';

import {doppelganger} from '../../src';
import Counter from '../helpers/interfaces/Counter.json';

use(chaiAsPromised);

describe('Doppelganger - Integration (called directly)', () => {
  const [wallet] = new MockProvider().getWallets();

  it('mocking mechanism works', async () => {
    const mockCounter = await doppelganger(wallet, Counter.interface);
    await mockCounter.read.returns(45291);
    const {contract} = mockCounter;

    const ret = await expect(contract.read()).to.be.eventually.fulfilled;
    expect(ret.toNumber()).to.be.equal(45291);
  });
});
