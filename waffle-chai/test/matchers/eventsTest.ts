import {expect, AssertionError} from 'chai';
import {Wallet, Contract, ContractFactory, BigNumber, ethers} from 'ethers';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../contracts/Events';

import type {TestProvider} from '@ethereum-waffle/provider';

/**
 * Struct emitted in the Events contract, emitStruct method
 */
const emittedStruct = {
  hash: '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
  value: BigNumber.from(1),
  encoded: [
    '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
    '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
  ]
};

/**
 * Struct emitted in the Events contract, emitNestedStruct method
 */
const emittedNestedStruct = {
  hash: '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
  value: BigNumber.from(1),
  task: emittedStruct
};

export const eventsTest = (provider: TestProvider) => {
  let wallet: Wallet;
  let events: Contract;
  let factory: ContractFactory;

  before(async () => {
    const wallets = provider.getWallets();
    wallet = wallets[0];
  });

  beforeEach(async () => {
    factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, wallet);
    events = await factory.deploy();
  });

  it('Emit one: success', async () => {
    await expect(events.emitOne()).to.emit(events, 'One');
  });

  it('Emit one: fail', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'Two')
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected event "Two" to be emitted, but it wasn\'t'
    );
  });

  it('Emit two: success', async () => {
    await expect(events.emitTwo())
      .to.emit(events, 'Two')
      .withArgs(2, 'Two');
  });

  it('Emit two: fail', async () => {
    await expect(
      expect(events.emitTwo()).to.emit(events, 'One')
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected event "One" to be emitted, but it wasn\'t'
    );
  });

  it('Emit index: success', async () => {
    const bytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Three'));
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Three'));
    await expect(events.emitIndex())
      .to.emit(events, 'Index')
      .withArgs(
        hash,
        'Three',
        bytes,
        hash,
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
      );
    await expect(events.emitIndex())
      .to.emit(events, 'Index')
      .withArgs(
        'Three',
        'Three',
        bytes,
        bytes,
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
      );
  });

  it('Do not emit one: fail', async () => {
    await expect(
      expect(events.emitOne()).to.not.emit(events, 'One')
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected event "One" NOT to be emitted, but it was'
    );
  });

  it('Do not emit two: success', async () => {
    await expect(events.emitTwo()).to.not.emit(events, 'One');
  });

  it('Emit nonexistent event: fail', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'Three')
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected event "Three" to be emitted, but it doesn\'t exist in the contract. ' +
        'Please make sure you\'ve compiled its latest version before running the test.'
    );
  });

  it('Negate emit nonexistent event: fail', async () => {
    await expect(
      expect(events.emitOne()).not.to.emit(events, 'Three')
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'WARNING: Expected event "Three" NOT to be emitted. The event wasn\'t emitted because ' +
        'it doesn\'t exist in the contract. Please make sure you\'ve compiled its latest version ' +
        'before running the test.'
    );
  });

  it('Emit both: success (two expects)', async () => {
    await expect(events.emitBoth())
      .to.emit(events, 'One')
      .withArgs(
        1,
        'One',
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      );
    await expect(events.emitBoth()).to.emit(events, 'Two');
  });

  it('Emit both: success (one expect with two "to" prepositions)', async () => {
    await expect(events.emitBoth())
      .to.emit(events, 'One')
      .withArgs(
        1,
        'One',
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      )
      .and.to.emit(events, 'Two');
  });

  it('Event with proper args', async () => {
    await expect(events.emitOne())
      .to.emit(events, 'One')
      .withArgs(
        1,
        'One',
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
      );
  });

  it('Event with proper args from nested', async () => {
    await expect(events.emitNested())
      .to.emit(events, 'One')
      .withArgs(
        1,
        'One',
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
      );
  });

  it('Event with not enough args', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One').withArgs(1)
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected "One" event to have 1 argument(s), but it has 3'
    );
  });

  it('Event with too many args', async () => {
    await expect(
      expect(events.emitOne()).to.emit(events, 'One').withArgs(1, 2, 3, 4)
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected "One" event to have 4 argument(s), but it has 3'
    );
  });

  it('Event with one different arg (integer)', async () => {
    await expect(
      expect(events.emitOne())
        .to.emit(events, 'One')
        .withArgs(
          2,
          'One',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
        )
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected "1" to be equal 2'
    );
  });

  it('Event with one different arg (string)', async () => {
    await expect(
      expect(events.emitOne())
        .to.emit(events, 'One')
        .withArgs(
          1,
          'Two',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
        )
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'expected \'One\' to equal \'Two\''
    );
  });

  it('Event with one different arg (string) #2', async () => {
    await expect(
      expect(events.emitOne())
        .to.emit(events, 'One')
        .withArgs(
          1,
          'One',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
        )
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'expected \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\' ' +
        'to equal \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124\''
    );
  });

  it('Event with array of BigNumbers and bytes32 types', async () => {
    await expect(events.emitArrays())
      .to.emit(events, 'Arrays')
      .withArgs(
        [1, 2, 3],
        [
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
        ]
      );
  });

  it('Event with array of BigNumbers and bytes32 types too many arguments', async () => {
    await expect(
      expect(events.emitArrays())
        .to.emit(events, 'Arrays')
        .withArgs(
          [1, 2, 3, 4],
          [
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
          ]
        )
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected 1,2,3 to equal 1,2,3,4, but they have different lengths'
    );
  });

  it('Event with array of BigNumbers and bytes32 types not enough arguments', async () => {
    await expect(
      expect(events.emitArrays())
        .to.emit(events, 'Arrays')
        .withArgs(
          [1, 2, 3],
          [
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
          ]
        )
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected 0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123,' +
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124' +
          ' to equal 0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123,' +
          ' but they have different lengths'
    );
  });

  it('Event with array of BigNumbers providing bignumbers to the matcher', async () => {
    await expect(events.emitArrays())
      .to.emit(events, 'Arrays')
      .withArgs(
        [BigNumber.from(1), 2, BigNumber.from(3)],
        [
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
          '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
        ]
      );
  });

  it('Event with one different arg within array (bytes32)', async () => {
    await expect(
      expect(events.emitArrays())
        .to.emit(events, 'Arrays')
        .withArgs(
          [BigNumber.from(1), 2, BigNumber.from(3)],
          [
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162121',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
          ]
        )
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'expected \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\' ' +
        'to equal \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162121\''
    );
  });

  it('Event with one different arg within array (BigNumber)', async () => {
    await expect(
      expect(events.emitArrays())
        .to.emit(events, 'Arrays')
        .withArgs(
          [0, 2, 3],
          [
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162124'
          ]
        )
    ).to.be.eventually.rejectedWith(
      AssertionError,
      // eslint-disable-next-line no-useless-escape
      'Expected "1" to be equal 0'
    );
  });

  it('Emit event multiple times with different args', async () => {
    await expect(events.emitOneMultipleTimes())
      .to.emit(events, 'One')
      .withArgs(
        1,
        'One',
        '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
      )
      .and.to.emit(events, 'One')
      .withArgs(
        1,
        'DifferentKindOfOne',
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      );
  });

  it('Event args not found among multiple emitted events', async () => {
    await expect(
      expect(events.emitOneMultipleTimes())
        .to.emit(events, 'One')
        .withArgs(1, 2, 3, 4)
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Specified args not emitted in any of 3 emitted "One" events'
    );
  });

  it('With executed transaction', async () => {
    const tx = await events.emitOne();
    await expect(tx).to.emit(events, 'One');
  });

  it('With transaction hash', async () => {
    const tx = await events.emitOne();
    await expect(tx.hash).to.emit(events, 'One');
  });

  describe('Chaining matchers', () => {
    it('Both emitted and caught', async () => {
      const tx = await events.emitBoth();
      await expect(tx)
        .to.emit(events, 'One')
        .to.emit(events, 'Two');
    });

    it('One emitted, expecting one then two - fail', async () => {
      const tx = await events.emitOne();
      await expect(
        expect(tx)
          .to.emit(events, 'One')
          .to.emit(events, 'Two')
      ).to.be.eventually.rejectedWith(
        'Expected event "Two" to be emitted, but it wasn\'t'
      );
    });

    it('One emitted, expecting two then one - fail', async () => {
      const tx = await events.emitOne();
      await expect(
        expect(tx)
          .to.emit(events, 'Two')
          .to.emit(events, 'One')
      ).to.be.eventually.rejectedWith(
        'Expected event "Two" to be emitted, but it wasn\'t'
      );
    });

    it('Both emitted and caught with args', async () => {
      const tx = await events.emitBoth();
      await expect(tx)
        .to.emit(events, 'One').withArgs(
          1,
          'One',
          '0x0000000000000000000000000000000000000000000000000000000000000001'
        )
        .to.emit(events, 'Two').withArgs(
          2,
          'Two'
        );
    });

    it('One emitted, expecting one then two with args - fail', async () => {
      const tx = await events.emitOne();
      await expect(
        expect(tx)
          .to.emit(events, 'One').withArgs(
            1,
            'One',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
          )
          .to.emit(events, 'Two').withArgs(
            2,
            'Two'
          )
      ).to.be.eventually.rejectedWith(
        'Expected event "Two" to be emitted, but it wasn\'t'
      );
    });

    it('One emitted, expecting two then one with args - fail', async () => {
      const tx = await events.emitOne();
      await expect(
        expect(tx)
          .to.emit(events, 'Two').withArgs(
            2,
            'Two'
          )
          .to.emit(events, 'One').withArgs(
            1,
            'One',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
          )
      ).to.be.eventually.rejectedWith(
        'Expected event "Two" to be emitted, but it wasn\'t'
      );
    });

    it('Wrong args, expecting one then two - fail', async () => {
      const tx = await events.emitBoth();
      await expect(
        expect(tx)
          .to.emit(events, 'One').withArgs(
            1,
            'One',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
          )
          .to.emit(events, 'Two').withArgs(
            2,
            'Two'
          )
      ).to.be.eventually.rejectedWith(
        'expected \'0x0000000000000000000000000000000000000000000000000000000000000001\'' +
        ' to equal \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\''
      );
    });

    it('Wrong args, expecting two then one - fail', async () => {
      const tx = await events.emitBoth();
      await expect(
        expect(tx)
          .to.emit(events, 'Two').withArgs(
            2,
            'Two'
          )
          .to.emit(events, 'One').withArgs(
            1,
            'One',
            '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
          )
      ).to.be.eventually.rejectedWith(
        'expected \'0x0000000000000000000000000000000000000000000000000000000000000001\'' +
        ' to equal \'0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123\''
      );
    });

    it('Event emitted in one contract but not in the other', async () => {
      const differentEvents = await factory.deploy();
      await expect(events.emitOne())
        .to.emit(events, 'One')
        .and.not.to.emit(differentEvents, 'One');
    });

    it('Emit struct: success', async () => {
      await expect(events.emitStruct())
        .to.emit(events, 'Struct')
        .withArgs(emittedStruct);
    });

    it('Emit struct: fail', async () => {
      const struct = {
        ...emittedStruct,
        value: BigNumber.from(2) // different
      };
      await expect(
        expect(events.emitStruct()).to.emit(events, 'Struct').withArgs(struct)
      ).to.be.eventually.rejectedWith(
        AssertionError,
        'expected { Object (hash, value, ...) } to deeply equal { Object (hash, value, ...) }'
      );
    });

    it('Emit nested struct: success', async () => {
      await expect(events.emitNestedStruct())
        .to.emit(events, 'NestedStruct')
        .withArgs(emittedNestedStruct);
    });

    it('Emit nested struct: fail', async () => {
      const nestedStruct = {
        ...emittedNestedStruct,
        task: {
          ...emittedStruct,
          value: BigNumber.from(2) // different
        }
      };
      await expect(
        expect(events.emitNestedStruct()).to.emit(events, 'NestedStruct').withArgs(nestedStruct)
      ).to.be.eventually.rejectedWith(
        AssertionError,
        'expected { Object (hash, value, ...) } to deeply equal { Object (hash, value, ...) }'
      );
    });
  });
};

export const eventsWithNamedArgs = (provider: TestProvider) => {
  let wallet: Wallet;
  let events: Contract;
  let factory: ContractFactory;

  before(async () => {
    const wallets = provider.getWallets();
    wallet = wallets[0];
  });

  beforeEach(async () => {
    factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, wallet);
    events = await factory.deploy();
  });

  describe('events withNamedArgs', () => {
    it('all arguments', async () => {
      const bytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Three'));
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Three'));
      await expect(events.emitIndex())
        .to.emit(events, 'Index')
        .withNamedArgs({
          msgHashed: hash,
          msg: 'Three',
          bmsg: bytes,
          bmsgHash: hash,
          encoded: '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
        });
      await expect(events.emitIndex())
        .to.emit(events, 'Index')
        .withNamedArgs({
          msgHashed: 'Three',
          msg: 'Three',
          bmsg: bytes,
          bmsgHash: hash,
          encoded: '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
        });
    });

    it('some arguments', async () => {
      const bytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Three'));
      const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Three'));
      await expect(events.emitIndex())
        .to.emit(events, 'Index')
        .withNamedArgs({
          msg: 'Three',
          bmsg: bytes,
          bmsgHash: hash
        });
      await expect(events.emitIndex())
        .to.emit(events, 'Index')
        .withNamedArgs({
          msgHashed: 'Three',
          bmsg: bytes,
          bmsgHash: hash,
          encoded: '0x00cfbbaf7ddb3a1476767101c12a0162e241fbad2a0162e2410cfbbaf7162123'
        });
    });

    it('invalid msgHashed hash argument', async () => {
      const bytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Three'));
      const invalidHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Four'));
      await expect(
        expect(events.emitIndex())
          .to.emit(events, 'Index')
          .withNamedArgs({
            msgHashed: invalidHash,
            msg: 'Three',
            bmsg: bytes
          })
      ).to.be.eventually.rejectedWith(
        AssertionError,
        'value of indexed "msgHashed" argument in the "Index" event to be hash of or equal to ' +
        '"0x4fae3e1262df6a76b5264b9d4166a5e6091b6b71d48e83583b2221b15d01023a": expected ' +
        '\'0x67f5166e905e8b1b2000651b3d5254f5a93e1ae1a689ce8930cd41a6d56ac00f\' to be one of [ Array(2) ]'
      );
    });

    it('invalid msgHashed unhashed argument', async () => {
      const bytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Three'));
      await expect(
        expect(events.emitIndex())
          .to.emit(events, 'Index')
          .withNamedArgs({
            msgHashed: 'Four',
            msg: 'Three',
            bmsg: bytes
          })
      ).to.be.eventually.rejectedWith(
        AssertionError,
        'value of indexed "msgHashed" argument in the "Index" event to be hash of or equal to ' +
        '"Four": expected ' +
        '\'0x67f5166e905e8b1b2000651b3d5254f5a93e1ae1a689ce8930cd41a6d56ac00f\' to be one of [ Array(2) ]'
      );
    });

    it('invalid msg argument', async () => {
      const bytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Three'));
      await expect(
        expect(events.emitIndex())
          .to.emit(events, 'Index')
          .withNamedArgs({
            msgHashed: 'Three',
            msg: 'Four',
            bmsg: bytes
          })
      ).to.be.eventually.rejectedWith(
        AssertionError,
        'value of "msg" argument in the "Index" event: expected ' +
        '\'Three\' to equal \'Four\''
      );
    });

    it('missing argument', async () => {
      await expect(
        expect(events.emitIndex())
          .to.emit(events, 'Index')
          .withNamedArgs({
            invalid: 'XXXX'
          })
      ).to.be.eventually.rejectedWith(
        AssertionError,
        '"invalid" argument in the "Index" event not found: expected -1 to be at least 0'
      );
    });
  });
};
