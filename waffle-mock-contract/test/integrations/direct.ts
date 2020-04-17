import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MockProvider} from '@ethereum-waffle/provider';
import {waffleChai} from '@ethereum-waffle/chai';

import {deployMockContract} from '../../src';
import Counter from '../helpers/interfaces/Counter.json';

use(chaiAsPromised);
use(waffleChai);

describe('Doppelganger - Integration (called directly)', () => {
  const [wallet] = new MockProvider().getWallets();

  it('mocking mechanism works', async () => {
    const mockCounter = await deployMockContract(wallet, Counter.interface);
    await mockCounter.mock.read.returns(45291);

    expect(await mockCounter.read()).to.equal(45291);
  });
});
