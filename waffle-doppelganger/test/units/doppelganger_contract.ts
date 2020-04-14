import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {deployContract, MockProvider} from 'ethereum-waffle';
import {Contract, utils} from 'ethers';

import DoppelgangerContract from '../../build/Doppelganger.json';
import Counter from '../helpers/interfaces/Counter.json';

use(chaiAsPromised);

describe('Doppelganger - Contract', () => {
  const [wallet] = new MockProvider().getWallets();

  describe('mocking mechanism', () => {
    const readSignature = '0x57de26a4';

    it('returns preprogrammed return values for mocked functions', async () => {
      const contract = await deployContract(wallet, DoppelgangerContract);
      const pretender = new Contract(contract.address, Counter.interface, wallet);

      const value = '0x1000000000000000000000000000000000000000000000000000000000004234';
      await contract.mockReturns(readSignature, value);
      const ret = await expect(pretender.read()).to.eventually.be.fulfilled;
      expect(utils.hexlify(ret)).to.equal(value);
    });
  });
});
