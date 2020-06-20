import {Contract, ContractFactory} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';

describe('INTEGRATION: Events Emitted', () => {
  const [wallet] = new MockProvider().getWallets();
  let factory: ContractFactory;
  let events: Contract;

  beforeEach(async () => {
    factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, wallet);
    events = await factory.deploy();
  });

  it('Emit one: success', async () => {
    const tx = await events.emitOne();
    await expect(tx).toHaveEmitted(events, 'One');
  });

  it('Emit one: fail', async () => {
    const tx = await events.emitOne();
    await expect(
      expect(tx).toHaveEmitted(events, 'Two')
    ).rejects.toThrowError(
      'Expected event "Two" to be emitted, but it wasn\'t'
    );
  });

  it('Emit two: success', async () => {
    const tx = await events.emitTwo();
    await expect(tx).toHaveEmitted(events, 'Two');
  });

  it('Emit two: fail', async () => {
    const tx = await events.emitTwo();
    await expect(
      expect(tx).toHaveEmitted(events, 'One')
    ).rejects.toThrowError(
      'Expected event "One" to be emitted, but it wasn\'t'
    );
  });

  it('Do not emit one: fail', async () => {
    const tx = await events.emitOne();
    await expect(
      expect(tx).not.toHaveEmitted(events, 'One')
    ).rejects.toThrowError(
      'Expected event "One" NOT to be emitted, but it was'
    );
  });

  it('Do not emit two: success', async () => {
    const tx = await events.emitTwo();
    await expect(tx).not.toHaveEmitted(events, 'One');
  });

  it('Emit non-existent event: fail', async () => {
    const tx = await events.emitOne();
    await expect(
      expect(tx).toHaveEmitted(events, 'Three')
    ).rejects.toThrowError(
      'Expected event "Three" to be emitted, but it doesn\'t exist in the contract. ' +
        'Please make sure you\'ve compiled its latest version before running the test.'
    );
  });
});
