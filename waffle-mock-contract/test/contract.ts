import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MockProvider} from '@ethereum-waffle/provider';
import {Contract, ContractFactory} from 'ethers';

import DoppelgangerContract from '../src/Doppelganger.json';
import Counter from './helpers/interfaces/Counter.json';

use(chaiAsPromised);

describe('Doppelganger - Contract', () => {
  const [wallet] = new MockProvider().getWallets();

  describe('mocking mechanism', () => {
    const readSignature = '0x57de26a4';

    it('returns preprogrammed return values for mocked functions', async () => {
      const factory = new ContractFactory(DoppelgangerContract.abi, DoppelgangerContract.bytecode, wallet);
      const contract = await factory.deploy();
      const pretender = new Contract(contract.address, Counter.interface, wallet);
      const value = '0x1000000000000000000000000000000000000000000000000000000000004234';

      await contract.mockReturns(readSignature, value);

      expect(await pretender.read()).to.equal(value);
    });
  });
});
