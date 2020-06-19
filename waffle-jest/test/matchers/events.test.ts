import {Contract, ContractFactory} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';

describe('INTEGRATION: Events', () => {
  const [wallet] = new MockProvider().getWallets();
  let factory: ContractFactory;
  let events: Contract;

  beforeEach(async () => {
    factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, wallet);
    events = await factory.deploy();
  });

  it('Emit one: success', async () => {
    await expect(events.emitOne()).toEmit(events, 'One');
  });

  it('Emit one: fail', async () => {
    await expect(
      expect(events.emitOne()).toEmit(events, 'Two')
    ).rejects.toThrowError(
      'Expected event "Two" to be emitted, but it wasn\'t'
    );
  });

  it('Emit two: success', async () => {
    await expect(events.emitTwo()).toEmit(events, 'Two');
  });

  it('Emit two: fail', async () => {
    await expect(
      expect(events.emitTwo()).toEmit(events, 'One')
    ).rejects.toThrowError(
      'Expected event "One" to be emitted, but it wasn\'t'
    );
  });

  it('Do not emit one: fail', async () => {
    await expect(
      expect(events.emitOne()).not.toEmit(events, 'One')
    ).rejects.toThrowError(
      'Expected event "One" NOT to be emitted, but it was'
    );
  });

  it('Do not emit two: success', async () => {
    await expect(events.emitTwo()).not.toEmit(events, 'One');
  });

  it('Emit non-existent event: fail', async () => {
    await expect(
      expect(events.emitOne()).toEmit(events, 'Three')
    ).rejects.toThrowError(
      'Expected event "Three" to be emitted, but it doesn\'t exist in the contract. ' +
        'Please make sure you\'ve compiled its latest version before running the test.'
    );
  });

  // it('Emit both: success (two expects)', async () => {
  //   await expect(events.emitBoth())
  //     .toEmit(events, 'One')
  //     .withArgs(
  //       1,
  //       'One',
  //       '0x0000000000000000000000000000000000000000000000000000000000000001'
  //     );
  //   await expect(events.emitBoth()).toEmit(events, 'Two');
  // });

  // it('Emit both: success (one expect with two to)', async () => {
  //   await expect(events.emitBoth())
  //     .toEmit(events, 'One')
  //     .withArgs(
  //       1,
  //       'One',
  //       '0x0000000000000000000000000000000000000000000000000000000000000001'
  //     )
  //     .and.toEmit(events, 'Two');
  // });

  // it('Event with proper args', async () => {
  //   await expect(events.emitOne())
  //     .toEmit(events, 'One')
  //     .withArgs(
  //       1,
  //       'One',
  //       '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
  //     );
  // });

  // it('Event with not enough args', async () => {
  //   await expect(
  //     expect(events.emitOne()).toEmit(events, 'One').withArgs(1)
  //   ).to.be.eventually.rejectedWith(
  //     AssertionError,
  //     'Expected "One" event to have 1 argument(s), but has 3'
  //   );
  // });

  // it('Event with too many args', async () => {
  //   await expect(
  //     expect(events.emitOne()).toEmit(events, 'One').withArgs(1, 2, 3, 4)
  //   ).to.be.eventually.rejectedWith(
  //     AssertionError,
  //     'Expected "One" event to have 4 argument(s), but has 3'
  //   );
  // });

  // it('Event with one different arg (integer)', async () => {
  //   await expect(
  //     expect(events.emitOne())
  //       .toEmit(events, 'One')
  //       .withArgs(
  //         2,
  //         'One',
  //         '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
  //       )
  //   ).to.be.eventually.rejectedWith(
  //     AssertionError,
  //     'Expected "2" to be equal 1'
  //   );
  // });

  // it('Event with one different arg (string)', async () => {
  //   await expect(
  //     expect(events.emitOne())
  //       .toEmit(events, 'One')
  //       .withArgs(
  //         1,
  //         'Two',
  //         '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
  //       )
  //   ).to.be.eventually.rejectedWith(
  //     AssertionError,
  //     'expected \'Two\' to equal \'One\''
  //   );
  // });

  // it('Event with one different arg (string)', async () => {
  //   await expect(
  //     expect(events.emitOne())
  //       .toEmit(events, 'One')
  //       .withArgs(
  //         1,
  //         'One',
  //         '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
  //       )
  //   ).to.be.eventually.rejectedWith(
  //     AssertionError,
  //     'expected \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124\' ' +
  //       'to equal \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\''
  //   );
  // });

  // it('Event with array of BigNumbers and bytes32 types', async () => {
  //   await expect(events.emitArrays())
  //     .toEmit(events, 'Arrays')
  //     .withArgs(
  //       [1, 2, 3],
  //       [
  //         '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
  //         '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
  //       ]
  //     );
  // });

  // it('Event with array of BigNumbers providing bignumbers to the matcher', async () => {
  //   await expect(events.emitArrays())
  //     .toEmit(events, 'Arrays')
  //     .withArgs(
  //       [BigNumber.from(1), 2, BigNumber.from(3)],
  //       [
  //         '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
  //         '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
  //       ]
  //     );
  // });

  // it('Event with one different arg within array (bytes32)', async () => {
  //   await expect(
  //     expect(events.emitArrays())
  //       .toEmit(events, 'Arrays')
  //       .withArgs(
  //         [BigNumber.from(1), 2, BigNumber.from(3)],
  //         [
  //           '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162121',
  //           '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
  //         ]
  //       )
  //   ).to.be.eventually.rejectedWith(
  //     AssertionError,
  //     'expected \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162121\' ' +
  //       'to equal \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\''
  //   );
  // });

  // it('Event with one different arg within array (BigNumber)', async () => {
  //   await expect(
  //     expect(events.emitArrays())
  //       .toEmit(events, 'Arrays')
  //       .withArgs(
  //         [0, 2, 3],
  //         [
  //           '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
  //           '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
  //         ]
  //       )
  //   ).to.be.eventually.rejectedWith(
  //     AssertionError,
  //     // eslint-disable-next-line no-useless-escape
  //     'Expected "0" to be equal 1'
  //   );
  // });

  // it('Event emitted in one contract but not in the other', async () => {
  //   const differentEvents = await factory.deploy();
  //   await expect(events.emitOne())
  //     .toEmit(events, 'One')
  //     .and.not.toEmit(differentEvents, 'One');
  // });

  // it('Emit event multiple times with different args', async () => {
  //   await expect(events.emitOneMultipleTimes())
  //     .toEmit(events, 'One')
  //     .withArgs(
  //       1,
  //       'One',
  //       '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
  //     )
  //     .and.toEmit(events, 'One')
  //     .withArgs(
  //       1,
  //       'DifferentKindOfOne',
  //       '0x0000000000000000000000000000000000000000000000000000000000000001'
  //     );
  // });

  // it('Event args not found among multiple emitted events', async () => {
  //   await expect(
  //     expect(events.emitOneMultipleTimes())
  //       .toEmit(events, 'One')
  //       .withArgs(1, 2, 3, 4)
  //   ).to.be.eventually.rejectedWith(
  //     AssertionError,
  //     'Specified args not emitted in any of 3 emitted "One" events'
  //   );
  // });
});
