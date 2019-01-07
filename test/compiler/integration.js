import fs from 'fs';
import fsx from 'fs-extra';
import {join} from 'path';
import {expect} from 'chai';
import {compile} from '../../lib/compiler';
import {readFileContent, isFile} from '../../lib/utils';

const configurations = [
  './test/compiler/custom/config.json',
  './test/compiler/custom/config_native.json',
  './test/compiler/custom/config_docker.json',
  './test/compiler/custom_solidity_4/config_solcjs.json'
];

const artefacts = [
  'Custom.json',
  'CustomSafeMath.json',
  'ERC20.json',
  'One.json',
  'Two.json'
];

describe('Compiler integration', () => {
  for (const configurationPath of configurations)  {
    const configuration = JSON.parse(readFileContent(configurationPath));
    const {name, targetPath} = configuration;

    /* eslint-disable no-loop-func */
    describe(name, () => {
      before(async () => {
        fsx.removeSync(targetPath);
        await compile(configurationPath);
      });

      it('produce output files', async () => {
        expect(fs.existsSync(targetPath), `Expected build path "${targetPath}" to exist.`).to.be.true;
        for (const artefact of artefacts) {
          const filePath = join(targetPath, artefact);
          expect(isFile(filePath), `Expected compilation artefact "${filePath}" to exist.`).to.be.true;
        }
      });

      it('produce bytecode', async () => {
        for (const artefact of artefacts) {
          const filePath = join(targetPath, artefact);
          const content = JSON.parse(readFileContent(filePath));
          expect(content.evm, `Compilation artefact "${filePath}" expected to contain evm section`).to.be.ok;
          expect(content.evm.bytecode.object).to.startWith('60806040');
        }
      });

      it('produce abi', async () => {
        for (const artefact of artefacts) {
          const filePath = join(targetPath, artefact);
          const content = JSON.parse(readFileContent(filePath));
          expect(content.abi, `"${filePath}" expected to have abi`).to.be.ok;
          expect(content.abi, `"${filePath}" abi expected to be array, but was "${typeof content.abi}"`).to.be.an('array');
          expect(content.abi[0], `"${filePath}" abi expected to contain objects, but was "${typeof content.abi[0]}"`).to.be.an('object');
        }
      });
    });
  }
});
