import fsx from 'fs-extra';
import {join} from 'path';
import {expect} from 'chai';
import {compileProject} from '../../lib/compiler/compiler';
import {readFileContent} from '../../lib/utils';
import {utils} from 'ethers';

describe('E2E: humanReadableAbi', () => {
  before(() => {
    process.chdir('test/projects/humanReadableAbi');
  });

  beforeEach(() => {
    fsx.removeSync('build');
  });

  it(`"outputHumanReadableAbi" makes output contain humanReadableAbi`, async () => {
    await compileProject('config.json');

    const filePath = join('./build', 'MyContract.json');
    const { humanReadableAbi } = JSON.parse(readFileContent(filePath));

    expect(humanReadableAbi.sort()).to.deep.equal([
      'constructor(uint256 argOne)',
      'event Bar(bool argOne, uint256 indexed argTwo)',
      'event FooEvent()',
      'function noArgs() view returns(uint200)',
      'function oneArg(bool argOne)',
      'function threeArgs(string argOne, bool argTwo, uint256[] argThree) view returns(bool, uint256)',
      'function twoReturns(bool argOne) view returns(bool, uint256)'
    ]);
    expect(() => new utils.Interface(humanReadableAbi)).not.to.throw();
  });

  it(`By default output does not contain humanReadableAbi`, async () => {
    await compileProject('config2.json');

    const filePath = join('./build', 'MyContract.json');
    const { humanReadableAbi } = JSON.parse(readFileContent(filePath));

    expect(humanReadableAbi).to.equal(undefined);
  });

  after(async () => {
    process.chdir('../../..');
  });
});
