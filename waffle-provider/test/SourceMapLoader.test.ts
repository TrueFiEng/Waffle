import {expect} from 'chai';
import {
  ContractSources,
  findContractUri,
  getPushSize,
  parseItem,
  parseSourceMap,
  SourceMap,
  SourceMapItem
} from '../src/SourceMapLoader';

interface ValidSourceMapInterface {
  input: string;
  output: SourceMap;
}

const UNDEFINED_ITEM = undefined as unknown as SourceMapItem;

const VALID_SOURCE_MAP: ValidSourceMapInterface = {
  input: '315:757:2:-;;;;8:9:-1;5:2',
  output: [
    {
      file: 2,
      jumpType: 'normal',
      length: 757,
      modifierDepth: 0,
      offset: 315
    },
    {
      file: 2,
      jumpType: 'normal',
      length: 757,
      modifierDepth: 0,
      offset: 315
    },
    {
      file: 2,
      jumpType: 'normal',
      length: 757,
      modifierDepth: 0,
      offset: 315
    },
    {
      file: 2,
      jumpType: 'normal',
      length: 757,
      modifierDepth: 0,
      offset: 315
    },
    {
      file: -1,
      jumpType: 'normal',
      length: 9,
      modifierDepth: 0,
      offset: 8
    },
    {
      file: -1,
      jumpType: 'normal',
      length: 2,
      modifierDepth: 0,
      offset: 5
    }
  ]
};

const VALID_FILLED_FIRST_ITEM = VALID_SOURCE_MAP.output[0];

const CONTRACT_SOURCES = [
  [
    '@openzeppelin/contracts/GSN/Context.sol',
    {
      id: 1,
      uri:
        '/Users/jozwiak/WebstormProjects/waffle-stack-traces/node_modules/@openzeppelin/contracts/GSN/Context.sol'
    }
  ],
  [
    '@openzeppelin/contracts/ownership/Ownable.sol',
    {
      id: 2,
      uri: '/Users' +
        '/jozwiak/WebstormProjects/waffle-stack-traces/node_modules/@openzeppelin/contracts/ownership/Ownable.sol'
    }
  ]
] as ContractSources;

describe('INTEGRATION: SourceMapLoader', () => {
  it('findContractUri', async () => {
    expect(findContractUri(CONTRACT_SOURCES, VALID_FILLED_FIRST_ITEM)).to.eq(CONTRACT_SOURCES[1][1].uri);
  });

  it('parseSourceMap', async () => {
    expect(parseSourceMap(VALID_SOURCE_MAP.input)).to.eql(VALID_SOURCE_MAP.output);
  });

  describe('getPushSize', () => {
    it('returns 0 for number lower than 96 or bigger than 127', () => {
      expect(getPushSize(0x40)).to.eq(0);
    });

    it('returns calculated size for number bigger than 96 and lower than 127', () => {
      expect(getPushSize(0x70)).to.eq(17);
    });
  });

  describe('parseItem', () => {
    it('parses fully filled item with previous undefined', () => {
      const item = parseItem(UNDEFINED_ITEM, '315:757:2:-');
      expect(item).eql({
        offset: 315,
        length: 757,
        file: 2,
        jumpType: 'normal',
        modifierDepth: 0
      });
    });

    it('parses partially filled item', () => {
      const item = parseItem(VALID_FILLED_FIRST_ITEM, '191:120::o');
      expect(item).eql({
        offset: 191,
        length: 120,
        file: 2,
        jumpType: 'out',
        modifierDepth: 0
      });
    });

    it('parses item with only jumpType field', () => {
      const item = parseItem(VALID_FILLED_FIRST_ITEM, ':::i');
      expect(item).to.include({jumpType: 'in'});
    });

    it('parses empty item', () => {
      const item = parseItem(VALID_FILLED_FIRST_ITEM, '');
      expect(item).to.eql(VALID_FILLED_FIRST_ITEM);
    });
  });
});
