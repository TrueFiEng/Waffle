import {expect} from 'chai';
import fs from 'fs-extra';
import {inputToConfig} from '../../src/config';
import {flattenAndSave} from '../../src/flattener';

const sourceDirectory = './test/flattener/testSource';
const flattenOutputDirectory = './test/flattener/flattenFiles';
const compilerVersion = 'v0.5.9+commit.e560f70d';
const config = inputToConfig({
  sourceDirectory,
  flattenOutputDirectory,
  compilerVersion
});

describe('flattening', () => {
  after(async () => {
    await fs.remove(flattenOutputDirectory);
  });

  it('should include the parent if the child file', async () => {
    await flattenAndSave(config);
    const file = fs.readFileSync('./test/flattener/flattenFiles/child.sol', 'utf8');
    expect(file).includes('contract Parent');
  });

  it('should leave multiple solidity pragmas', async () => {
    await flattenAndSave(config);
    const file = fs.readFileSync('./test/flattener/flattenFiles/child.sol', 'utf8');
    expect(file)
      .includes('pragma solidity ^0.5.0')
      .and.includes('pragma solidity >=0.4.24 <0.6.0')
      .and.includes('pragma solidity ^0.5.2');
  });
});
