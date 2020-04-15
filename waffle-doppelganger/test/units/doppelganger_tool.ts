import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {MockProvider} from 'ethereum-waffle';

import {doppelganger, Doppelganger} from '../../src';
import Counter from '../helpers/interfaces/Counter.json';

use(chaiAsPromised);
use(sinonChai);

describe('Doppelganger - Tool', () => {
  const [wallet] = new MockProvider().getWallets();
  const contractStub = {
    mockReturns: sinon.stub(),
    address: '0x611a67665039c461f397af10ca7a972eb89d0171'
  } as any;
  let mockContract: Doppelganger;

  beforeEach(async () => {
    mockContract = await doppelganger(wallet, Counter.interface, contractStub);
  });

  it('address property proxies the contract instance address', () => {
    expect(mockContract.address).to.equal(contractStub.address);
  });

  describe('behavior controls', () => {
    it('`mock.returns` calls the mockReturns method of the mock contract', async () => {
      await expect(mockContract.mock.read.returns(1234)).to.eventually.be.fulfilled;
      expect(contractStub.mockReturns).to.have.been.calledOnceWith(
        '0x57de26a4',
        '0x00000000000000000000000000000000000000000000000000000000000004d2'
      );
    });
  });
});
