import {expect} from 'chai';
import {
  ContractSources,
  findContractUri, getInstructionIndex, getLine,
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
  it('findContractUri', () => {
    expect(findContractUri(CONTRACT_SOURCES, VALID_FILLED_FIRST_ITEM)).to.eq(CONTRACT_SOURCES[1][1].uri);
  });

  it('parseSourceMap', () => {
    expect(parseSourceMap(VALID_SOURCE_MAP.input)).to.eql(VALID_SOURCE_MAP.output);
  });

  describe('getInstructionIndex', () => {
    it('returns instruction index for proper bytecode', async () => {
      const bytecode = '60806040523480';
      expect(getInstructionIndex(bytecode, 6)).to.eq(3);
    });
    it('returns 0 for empty bytecode', async () => {
      const bytecodeEmpty = '';
      expect(getInstructionIndex(bytecodeEmpty, 6)).to.eq(0);
    });
  });

  describe('getLine', () => {
    const source = 'pragma solidity ^0.5.0;\nlibrary SafeMath';

    it('returns line number for offset eq to 0', () => {
      expect(getLine(source, 0)).to.eq(1);
    });

    it('returns next line number', () => {
      expect(getLine(source, 28)).to.eq(2);
    });

    it('returns line number for offset grater then source length', () => {
      expect(getLine(source, source.length + 1)).to.eq(2);
    });
  });

  describe('getPushSize', () => {
    it('returns 0 for byte lower than 0x60 or bigger than 0x7f', () => {
      expect(getPushSize(0x40)).to.eq(0);
    });

    it('returns calculated size for byte bigger than 0x60 and lower than 0x7f', () => {
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
