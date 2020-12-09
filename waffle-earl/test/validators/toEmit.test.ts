import {expect} from 'earljs';
import {BigNumber, Contract, ContractFactory} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';

describe('toEmit', () => {
  const [wallet] = new MockProvider().getWallets();
  let events: Contract;

  before(async () => {
    const factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, wallet);
    events = await factory.deploy();
  });

  it('checks that event was emitted', async () => {
    await expect(events.emitOne()).toEmit(events, 'One');
  });

  it('checks that event was not emitted', async () => {
    await expect(events.emitOne()).not.toEmit(events, 'Two');
  });

  it('checks args', async () => {
    await expect(events.emitOne()).toEmit(events, 'One', [
      BigNumber.from(1),
      'One',
      expect.aHexString(64)
    ]);
    await expect(events.emitOne()).not.toEmit(events, 'One', [
      BigNumber.from(2),
      'Two'
    ]);
  });
});
