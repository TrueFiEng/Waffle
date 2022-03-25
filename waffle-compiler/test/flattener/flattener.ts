import {expect} from 'chai';
import fs from 'fs-extra';
import {inputToConfig, flattenAndSave, flattenSingleFile, normalizeSpdxLicenceIdentifiers} from '../../src';

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

  it('properly flats source', async () => {
    const flattenFile = await flatAndGetChild();
    const expectedFile = fs.readFileSync('./test/flattener/expectedFlattenChild.sol', 'utf8');
    expect(flattenFile).eq(expectedFile);
  });

  it('should comment all solidity pragmas from dependency', async () => {
    const file = await flatAndGetChild();
    expect(file)
      .includes('// pragma solidity ^0.5.0;')
      .and.includes('// pragma solidity ^0.5.2;');
  });

  it('leaves source pragma uncommented', async () => {
    const file = await flatAndGetChild();
    expect(file).to.include('\npragma solidity >=0.4.24 <0.6.0;');
  });

  it('leaves other pragmas uncommented', async () => {
    const file = await flatAndGetChild();
    expect(file).to.include('\npragma experimental ABIEncoderV2;');
  });

  it('test', () => {
    expect(normalizeSpdxLicenceIdentifiers(`test
            // SPDX-License-Identifier: UNLICENSED
        //    SPDX-License-Identifier: MIT
        test2
                  // SPDX-License-Identifier: WTFPL
                  test3
            `, 'test.sol')).to.equal(`test
            // SPDX-License-Identifier: UNLICENSED

        test2

                  test3
            `);
  });

  it('single file flattening', async () => {
    const expectedFile = fs.readFileSync('./test/flattener/expectedFlattenChild.sol', 'utf8');
    expect(await flattenSingleFile(config, 'child.sol')).to.equal(expectedFile);
  });
});
