import {expect} from 'chai';
import fs from 'fs-extra';
import {inputToConfig} from '../../src/config';
import {flattenAndSave} from '../../src';

const sourceDirectory = './test/flattener/testSource';
const flattenOutputDirectory = './test/flattener/flattenFiles';
const compilerVersion = 'v0.5.9+commit.e560f70d';
const config = inputToConfig({
  sourceDirectory,
  flattenOutputDirectory,
  compilerVersion
});

const flatAndGetChild = async () => {
  await flattenAndSave(config);
  return fs.readFileSync('./test/flattener/flattenFiles/child.sol', 'utf8');
};

describe('flattening', () => {
  after(async () => {
    await fs.remove(flattenOutputDirectory);
  });

  it('should include the parent in the child file', async () => {
    const file = await flatAndGetChild();
    expect(file).includes('contract Parent');
  });

  it('should comment all solidity pragmas from dependency', async () => {
    const file = await flatAndGetChild();
    expect(file)
      .includes('// pragma solidity ^0.5.0;')
      .and.includes('// pragma solidity ^0.5.2;');
  });

  it('leaves source pragma uncommented', async () => {
    const file = await flatAndGetChild();
    expect(file).includes('pragma solidity >=0.4.24 <0.6.0;');
  });
});
