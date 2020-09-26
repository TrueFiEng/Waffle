import {use, expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MockProvider} from '@ethereum-waffle/provider';
import {Contract, ContractFactory} from 'ethers';

import DoppelgangerContract from '../src/Doppelganger.json';
import Counter from './helpers/interfaces/Counter.json';
import CounterOverloaded from './helpers/interfaces/CounterOverloaded.json';

use(chaiAsPromised);

describe('Doppelganger - Contract', () => {
  const [wallet] = new MockProvider().getWallets();

  describe('mocking mechanism', () => {
    const readSignature = '0x57de26a4';

    const deploy = async () => {
      const factory = new ContractFactory(DoppelgangerContract.abi, DoppelgangerContract.bytecode, wallet);
      const contract = await factory.deploy();
      const pretender = new Contract(contract.address, Counter.abi, wallet);
      const pretenderOverloaded = new Contract(contract.address, CounterOverloaded.abi, wallet);

      return {contract, pretender, pretenderOverloaded};
    };

    it('reverts when trying to call a not initialized method', async () => {
      const {pretender} = await deploy();

      await expect(pretender.read()).to.be.revertedWith('Mock on the method is not initialized');
    });

    it('returns preprogrammed return values for mocked functions without arguments', async () => {
      const {contract, pretender} = await deploy();
      const returnedValue = '0x1000000000000000000000000000000000000000000000000000000000004234';

      await contract.__waffle__mockReturns(readSignature, returnedValue);

      expect(await pretender.read()).to.equal(returnedValue);
    });

    it('returns preprogrammed return values for mocked functions with arguments', async () => {
      const {contract, pretender} = await deploy();
      const addSignature = '0x1003e2d2';
      const callData = `${addSignature}0000000000000000000000000000000000000000000000000000000000000005`;
      const returnedValue = '0x1000000000000000000000000000000000000000000000000000000000004234';

      await contract.__waffle__mockReturns(callData, returnedValue);

      expect(await pretender.add(5)).to.equal(returnedValue);
    });

    it('allows function to be looked up by signature', async () => {
      const {contract, pretenderOverloaded} = await deploy();
      const addSignature = '0x4f2be91f';
      const callData = `${addSignature}`;
      const returnedValue = '0x1000000000000000000000000000000000000000000000000000000000004234';

      await contract.__waffle__mockReturns(callData, returnedValue);

      expect(await pretenderOverloaded['add()']()).to.equal(returnedValue);
    });

    it('reverts if mock was set up for call with some argument and method was called with another', async () => {
      const {contract, pretender} = await deploy();
      const addSignature = '0x1003e2d2';
      const callData = `${addSignature}0000000000000000000000000000000000000000000000000000000000000005`;
      const returnedValue = '0x1000000000000000000000000000000000000000000000000000000000004234';

      await contract.__waffle__mockReturns(callData, returnedValue);

      await expect(pretender.add(2)).to.be.revertedWith('Mock on the method is not initialized');
    });

    it('calls with function signatures are handled as default mocks', async () => {
      const {contract, pretender} = await deploy();
      const addSignature = '0x1003e2d2';
      const callData = `${addSignature}0000000000000000000000000000000000000000000000000000000000000005`;
      const returnedValue1 = '0x1000000000000000000000000000000000000000000000000000000000000001';
      const returnedValue2 = '0x1000000000000000000000000000000000000000000000000000000000000002';

      await contract.__waffle__mockReturns(callData, returnedValue1);
      await contract.__waffle__mockReturns(addSignature, returnedValue2);

      expect(await pretender.add(5)).to.equal(returnedValue1);
      expect(await pretender.add(6)).to.equal(returnedValue2);
    });

    it('supports different kinds of types as call arguments', async () => {
      const {contract, pretender} = await deploy();

      const signature = '0xa64898c7';
      const uint = '0000000000000000000000000000000000000000000000000000000000000001';
      const bool = '0000000000000000000000000000000000000000000000000000000000000000';
      // eslint-disable-next-line max-len
      const str = '000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003737472';
      // eslint-disable-next-line max-len
      const bytes = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020123000000000000000000000000000000000000000000000000000000000000';
      const callData = `${signature}${uint}${bool}${str}${bytes}`;
      // eslint-disable-next-line max-len
      const returnedValue = '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020123000000000000000000000000000000000000000000000000000000000000';

      await contract.__waffle__mockReturns(callData, returnedValue);

      expect(await pretender.testArgumentTypes(1, false, 'str', '0x0123')).to.equal('0x0123');
    });

    it('reverts with no message', async () => {
      const {contract, pretender} = await deploy();

      await contract.__waffle__mockReverts(readSignature, '');
      await expect(pretender.read()).to.be.revertedWith('');
    });

    it('reverts with correct message', async () => {
      const {contract, pretender} = await deploy();

      await contract.__waffle__mockReverts(readSignature, 'Mock revert');
      await expect(pretender.read()).to.be.revertedWith('Mock revert');
    });

    it('reverts only with certain arguments', async () => {
      const {contract, pretender} = await deploy();
      const addSignature = '0x1003e2d2';
      const callData = `${addSignature}0000000000000000000000000000000000000000000000000000000000000005`;
      const returnedValue = '0x1000000000000000000000000000000000000000000000000000000000004234';

      await contract.__waffle__mockReverts(callData, 'Mock revert');
      await contract.__waffle__mockReturns(addSignature, returnedValue);

      await expect(pretender.add(5)).to.be.revertedWith('Mock revert');
      expect(await pretender.add(4)).to.equal(returnedValue);
    });
  });

  describe('call mechanisms', () => {
    let doppelganger: Contract;
    let counter: Contract;

    beforeEach(async () => {
      const doppelgangerFactory = new ContractFactory(DoppelgangerContract.abi, DoppelgangerContract.bytecode, wallet);
      doppelganger = await doppelgangerFactory.deploy();
      const counterFactory = new ContractFactory(Counter.abi, Counter.bytecode, wallet);
      counter = await counterFactory.deploy();
    });

    describe('staticcall()', () => {
      it('should allow a user to call a contract through the mock', async () => {
        const fn = counter.interface.functions['read()'];
        const data = counter.interface.getSighash(fn);
        expect(await doppelganger.__waffle__staticcall(counter.address, data))
          .to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
      });
    });

    describe('call()', () => {
      it('should allow a user to execute a transaction through the mock', async () => {
        const fn = counter.interface.functions['increment()'];
        const data = counter.interface.getSighash(fn);
        await doppelganger.__waffle__call(counter.address, data);
        expect(await counter.read()).to.equal('1');
      });
    });
  });
});
