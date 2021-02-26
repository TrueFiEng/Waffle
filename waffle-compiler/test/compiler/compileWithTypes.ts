import {expect} from 'chai';
import {removeSync} from 'fs-extra';
import {join} from 'path';
import {compileProject} from '../../src';
import {isFile} from '../../src/utils';

describe('E2E: Compile with types', () => {
  before(() => {
    process.chdir('test/projects/typechain');
  });

  it('compiles with generation types using typechain', async () => {
    await compileProject('config.json');
    const filePath = join('./build/types', 'Constantinople.d.ts');
    expect(isFile(filePath), `Expected compilation artefact "${filePath}" to exist.`).to.equal(true);
  });

  after(() => {
    removeSync('build');
    removeSync('cache');
    process.chdir('../../..');
  });
});
