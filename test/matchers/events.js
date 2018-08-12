import chai, {AssertionError} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, deployContract, getWallets} from '../../lib/waffle';
import Events from './build/Events';
import solidity from '../../lib/matchers';

chai.use(solidity);
chai.use(chaiAsPromised);

const {expect} = chai;

describe('Events', () => {
  let provider;
  let events;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    events = await deployContract(wallet, Events);
  });

  it('Emit one: success', async () => {
    await expect(events.emitOne()).to.emit(events, 'One');
  });

  it('Emit one: fail', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'Two')
    ).to.be.eventually.rejectedWith(AssertionError, 'Expected event "Two" to emitted, but wasn\'t');
  });

  it('Emit two: success', async () => {
    await expect(events.emitTwo()).to.emit(events, 'Two');
  });

  it('Emit two: fail', async () => {
    await expect(
      expect(events.emitTwo()).to.emit(events, 'One')
    ).to.be.eventually.rejectedWith(AssertionError, 'Expected event "One" to emitted, but wasn\'t');
  });

  it('Emit both: success', async () => {
    await expect(events.emitBoth()).to.emit(events, 'One');
    await expect(events.emitBoth()).to.emit(events, 'Two');
  });

  it('Event with proper args', async () => {
    await (expect(events.emitOne()).to.emit(events, 'One')).withArgs(1, 'One');
  });

  it('Event with not enough args', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One').withArgs(1)
    ).to.be.eventually.rejectedWith(AssertionError, 'Expected "One" event to have 1 argument(s), but has 2');
  });

  it('Event with too many args', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One').withArgs(1, 2, 3)
    ).to.be.eventually.rejectedWith(AssertionError, 'Expected "One" event to have 3 argument(s), but has 2');
  });

  it('Event with one different arg (integer)', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One').withArgs(2, 'One')
    ).to.be.eventually.rejectedWith(AssertionError, 'Expected "2" to be equal 1');
  });

  it('Event with one different arg (string)', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One').withArgs(1, 'Two')
    ).to.be.eventually.rejectedWith(AssertionError, 'expected \'Two\' to equal \'One\'');
  });
});
