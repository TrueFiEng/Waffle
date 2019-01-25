import chai, {AssertionError} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from '../../lib/waffle';
import Events from './build/Events.json';
import { Contract } from 'ethers';

chai.use(solidity);
chai.use(chaiAsPromised);

const {expect} = chai;

describe('INTEGRATION: Events', () => {
  let provider;
  let events: Contract;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
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

  it('Emit both: success (two expects)', async () => {
    await expect(events.emitBoth())
      .to.emit(events, 'One')
      .withArgs(1, 'One', '0x0000000000000000000000000000000000000000000000000000000000000001');
    await expect(events.emitBoth()).to.emit(events, 'Two');
  });

  it('Emit both: success (one expect with two to)' , async () => {
    await expect(events.emitBoth())
      .to.emit(events, 'One')
      .withArgs(1, 'One', '0x0000000000000000000000000000000000000000000000000000000000000001')
      .and.to.emit(events, 'Two');
  });

  it('Event with proper args', async () => {
    await (expect(events.emitOne()).to.emit(events, 'One'))
      .withArgs(1, 'One', '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123');
  });

  it('Event with not enough args', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One').withArgs(1)
    ).to.be.eventually.rejectedWith(AssertionError, 'Expected "One" event to have 1 argument(s), but has 3');
  });

  it('Event with too many args', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One').withArgs(1, 2, 3, 4)
    ).to.be.eventually.rejectedWith(AssertionError, 'Expected "One" event to have 4 argument(s), but has 3');
  });

  it('Event with one different arg (integer)', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One')
        .withArgs(2, 'One', '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123')
    ).to.be.eventually.rejectedWith(AssertionError, 'Expected "2" to be equal 1');
  });

  it('Event with one different arg (string)', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One')
        .withArgs(1, 'Two', '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123')
    ).to.be.eventually.rejectedWith(AssertionError, 'expected \'Two\' to equal \'One\'');
  });

  it('Event with one different arg (string)', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One')
        .withArgs(1, 'One', '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124')
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'expected \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124\' ' +
      'to equal \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\''
    );
  });
});
