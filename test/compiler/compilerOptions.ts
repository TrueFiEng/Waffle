import fs from 'fs';
import fsx from 'fs-extra';
import {join} from 'path';
import {expect} from 'chai';
import {compileProject} from '../../lib/compiler/compiler';
import {readFileContent} from '../../lib/utils';

const configs = [
  'config.json',
  'config_docker.json',
  'config_native.json'
];

describe('E2E: Compiler options', () => {
  before(() => {
    process.chdir('test/projects/compilerOptions');
  });

  beforeEach(() => {
    fsx.removeSync('build');
  });

  for (const config of configs) {
    it(`[${config}] compiles using the provided options`, async () => {
      await compileProject(config);

      const filePath = join('./build', 'Constantinople.json');
      const content = JSON.parse(readFileContent(filePath));
      expect(content.evm.bytecode.opcodes.includes(' SHL ')).to.equal(true);
    });
  }

  after(async () => {
    process.chdir('../../..');
  });
});
