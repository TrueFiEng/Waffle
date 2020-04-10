import fsx from 'fs-extra';
import {join} from 'path';
import {expect} from 'chai';
import {utils} from 'ethers';
import {compileProject} from '../../src/compiler';
import {readFileContent} from '../../src/utils';
import {encodeSolidityValue} from '../../src/getHumanReadableAbi';

describe('E2E: humanReadableAbi', () => {
  before(() => {
    process.chdir('test/projects/humanReadableAbi');
  });

  beforeEach(() => {
    fsx.removeSync('build');
  });

  it('"outputHumanReadableAbi" makes output contain humanReadableAbi', async () => {
    await compileProject('config.json');

    const filePath = join('./build', 'MyContract.json');
    const {humanReadableAbi} = JSON.parse(readFileContent(filePath));

    expect(humanReadableAbi.sort()).to.deep.equal([
      'constructor(uint256 argOne)',
      'event Bar(bool argOne, uint256 indexed argTwo)',
      'event FooEvent()',
      // eslint-disable-next-line max-len
      'function complicated(tuple(string a, tuple(uint256 b) b, bool[] nested)[] items) returns(tuple(string a, tuple(uint256 b) b, bool[] nested))',
      'function noArgs() view returns(uint200)',
      'function oneArg(bool argOne)',
      'function threeArgs(string argOne, bool argTwo, uint256[] argThree) view returns(bool, uint256)',
      'function twoReturns(bool argOne) view returns(bool, uint256)'
    ]);
    expect(() => new utils.Interface(humanReadableAbi)).not.to.throw();
  });

  it('By default output does not contain humanReadableAbi', async () => {
    await compileProject('config2.json');

    const filePath = join('./build', 'MyContract.json');
    const {humanReadableAbi} = JSON.parse(readFileContent(filePath));

    expect(humanReadableAbi).to.equal(undefined);
  });

  after(async () => {
    process.chdir('../../..');
  });
});

describe('UNIT: encodeSolidityValue', () => {
  it('encodes a simple type', () => {
    const resut = encodeSolidityValue({
      type: 'uint256'
    });
    expect(resut).to.equal('uint256');
  });

  it('encodes a named type', () => {
    const resut = encodeSolidityValue({
      type: 'uint256',
      name: 'foo'
    });
    expect(resut).to.equal('uint256 foo');
  });

  it('encodes an indexed type', () => {
    const resut = encodeSolidityValue({
      type: 'uint256',
      name: 'foo',
      indexed: true
    });
    expect(resut).to.equal('uint256 indexed foo');
  });

  it('encodes a malformed tuple type', () => {
    const resut = encodeSolidityValue({
      type: 'tuple',
      name: 'foo'
    });
    expect(resut).to.equal('tuple foo');
  });

  it('encodes a simple tuple type', () => {
    const resut = encodeSolidityValue({
      type: 'tuple',
      name: 'foo',
      components: [
        {type: 'uint256', name: 'a'},
        {type: 'string', name: 'b'}
      ]
    });
    expect(resut).to.equal('tuple(uint256 a, string b) foo');
  });

  it('encodes a complex tuple type', () => {
    const resut = encodeSolidityValue({
      type: 'tuple[4]',
      name: 'foo',
      indexed: true,
      components: [
        {type: 'uint256'},
        {type: 'string', name: 'b'},
        {
          type: 'tuple',
          name: 'c',
          components: [
            {type: 'uint256[4]'}
          ]
        }
      ]
    });
    expect(resut).to.equal('tuple(uint256, string b, tuple(uint256[4]) c)[4] indexed foo');
  });
});
