import {expect, AssertionError} from 'chai';
import {createMockProvider, deployContract, getWallets} from '../../src';
import Events from './build/Events.json';
import {Contract, utils} from 'ethers';

describe('INTEGRATION: Events', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let events: Contract;

  beforeEach(async () => {
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

  it('Emit unexistent event: fail', async () => {
    await expect(expect(events.emitOne()).to.emit(events, 'Three')).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected event "Three" to be emitted, but it doesn\'t exist in the contract. ' +
      'Please make sure you\'ve compiled its latest version before running the test.'
    );
  });

  it('Negate emit unexistent event: fail', async () => {
    await expect(expect(events.emitOne()).not.to.emit(events, 'Three')).to.be.eventually.rejectedWith(
      AssertionError,
      'WARNING: Expected event "Three" NOT to be emitted. The event wasn\'t emitted because ' +
      'it doesn\'t exist in the contract. Please make sure you\'ve compiled its latest version ' +
      'before running the test.'
    );
  });

  it('Emit both: success (two expects)', async () => {
    await expect(events.emitBoth())
      .to.emit(events, 'One')
      .withArgs(1, 'One', '0x0000000000000000000000000000000000000000000000000000000000000001');
    await expect(events.emitBoth()).to.emit(events, 'Two');
  });

  it('Emit both: success (one expect with two to)', async () => {
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

  it('Event with array of BigNumbers and bytes32 types', async () => {
    await expect(events.emitArrays()).to.emit(events, 'Arrays')
      .withArgs(
        [1, 2, 3],
        ['0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124']);
  });

  it('Event with array of BigNumbers providing bignumbers to the matcher', async () => {
    await expect(events.emitArrays()).to.emit(events, 'Arrays')
      .withArgs(
        [utils.bigNumberify(1), 2, utils.bigNumberify(3)],
        ['0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124']);
  });

  it('Event with one different arg within array (bytes32)', async () => {
    await expect(
      expect(events.emitArrays()).to.emit(events, 'Arrays')
        .withArgs(
          [utils.bigNumberify(1), 2, utils.bigNumberify(3)],
          ['0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162121',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'])
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'expected \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162121\' ' +
      'to equal \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\''
    );
  });

  it('Event with one different arg within array (BigNumber)', async () => {
    await expect(
      expect(events.emitArrays()).to.emit(events, 'Arrays')
        .withArgs(
          [0, 2, 3],
          ['0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'])
    ).to.be.eventually.rejectedWith(
      AssertionError,
      // eslint-disable-next-line no-useless-escape
      'Expected \"0\" ' +
      'to be equal 1'
    );
  });
});
