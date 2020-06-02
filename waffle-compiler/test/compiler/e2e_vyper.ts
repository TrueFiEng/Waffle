import fs from 'fs';
import fsx from 'fs-extra';
import {join, dirname, basename} from 'path';
import {expect} from 'chai';
import {compileProject} from '../../src/compiler';
import {loadConfig} from '../../src/config';
import {readFileContent, isFile} from '../../src/utils';

const configurations = [
  './test/projects/vyper0.1/config_vyper_0b15.json',
  './test/projects/vyper0.1/config_vyper_0b17.json'
];

const artifacts: string[] = [
  'Custom.json'
];

describe('E2E: Vyper Compiler integration', async () => {
  for (const configurationPath of configurations) {
    const configuration = await loadConfig(configurationPath) as any;
    const {name, outputDirectory} = configuration;

    describe(`E2E: ${name}`, () => {
      const dir = process.cwd();

      before(async () => {
        process.chdir(dirname(configurationPath));
        fsx.removeSync(outputDirectory);
      });

      it('compiles without errors', async () => {
        await compileProject(basename(configurationPath));
      });

      after(() => {
        process.chdir(dir);
      });

      it('produce output files', async () => {
        expect(fs.existsSync(outputDirectory), `Expected build path "${outputDirectory}" to exist.`).to.equal(true);
        for (const artefact of artifacts) {
          const filePath = join(outputDirectory, artefact);
          expect(isFile(filePath), `Expected compilation artefact "${filePath}" to exist.`).to.equal(true);
        }
      });

      it('produce bytecode', async () => {
        for (const artefact of artifacts) {
          const filePath = join(outputDirectory, artefact);
          const content = JSON.parse(readFileContent(filePath));
          expect(content.evm, `Compilation artefact "${filePath}" expected to contain evm section`).to.be.ok;
          expect(content.evm.bytecode.object).to.startWith('0x');
        }
      });

      it('produce legacy bytecode', async () => {
        for (const artefact of artifacts) {
          const filePath = join(outputDirectory, artefact);
          const content = JSON.parse(readFileContent(filePath));
          expect(content.bytecode).to.deep.eq(content.evm.bytecode.object);
        }
      });

      it('produce abi', async () => {
        for (const artefact of artifacts) {
          const filePath = join(outputDirectory, artefact);
          const content = JSON.parse(readFileContent(filePath));
          expect(content.abi, `"${filePath}" expected to have abi`).to.be.an.instanceOf(Array);
          expect(
            content.abi,
            `"${filePath}" abi expected to be array, but was "${typeof content.abi}"`
          ).to.be.an('array');
          expect(
            content.abi[0],
            `"${filePath}" abi expected to contain objects, but was "${typeof content.abi[0]}"`
          ).to.be.an('object');
        }
      });
    });
  }
});
