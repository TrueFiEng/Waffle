import {expect} from 'chai';
import fsx from 'fs-extra';
import path from 'path';
import {compileAndSave} from '../../src';
import {inputToConfig} from '../../src/config';
import {generateTypes} from '../../src/generateTypes';

const sourceDirectory = './test/projects/example';
const outputDirectory = './test/projects/build';
const compilerVersion = 'v0.5.9+commit.e560f70d';
const config = inputToConfig({
  sourceDirectory,
  outputDirectory,
  compilerVersion
});

describe.only('Type generation with TypeChain', () => {
  it('outputs types to specified directory', async () => {
    await compileAndSave(config);
    const outputDirectoryForTypes = await generateTypes(config);
    expect(outputDirectoryForTypes).to.eq(path.join(config.outputDirectory, 'types'));
    const {BasicTokenMockFactory} = await import(path.join('..', '..', outputDirectoryForTypes, 'index.ts'));
    expect(BasicTokenMockFactory.name).to.equal('BasicTokenMockFactory');
    expect(Object.getPrototypeOf(BasicTokenMockFactory).name).to.equal('ContractFactory');
  });

  after(() => {
    // fsx.removeSync(outputDirectory);
  });
});
