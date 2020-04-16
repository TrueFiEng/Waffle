import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {ContractFactory} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';
import {waffleChai} from '@ethereum-waffle/chai';

import {deployMockContract} from '../../src';
import Counter from '../helpers/interfaces/Counter.json';
import Cap from '../helpers/interfaces/Cap.json';

use(chaiAsPromised);
use(waffleChai);

describe('Doppelganger - Integration (called by other contract)', () => {
  const [wallet] = new MockProvider().getWallets();

  it('mocking mechanism works', async () => {
    const mockCounter = await deployMockContract(wallet, Counter.interface);
    const capFactory = new ContractFactory(Cap.abi, Cap.bytecode, wallet);
    const capContract = await capFactory.deploy(mockCounter.address);

    await mockCounter.mock.read.returns(5);
    expect(await capContract.read()).to.be.equal(5);

    await mockCounter.mock.read.returns(12);
    expect(await capContract.read()).to.be.equal(10);
  });
});
