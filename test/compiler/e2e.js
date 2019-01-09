import fs from 'fs';
import fsx from 'fs-extra';
import {join, resolve} from 'path';
import {expect} from 'chai';
import {compile} from '../../lib/compiler';
import {readFileContent, isFile, deepCopy} from '../../lib/utils';
import {deployContract, link, getWallets, createMockProvider} from '../../lib/waffle';

const configurations = [
  './test/projects/custom/config.json',
  './test/projects/custom/config_native.json',
  './test/projects/custom/config_docker.json',
  './test/projects/custom_solidity_4/config_solcjs.json',
  './test/projects/custom_solidity_4/config_docker.json'
];

const artefacts = [
  'Custom.json',
  'CustomSafeMath.json',
  'ERC20.json',
  'One.json',
  'Two.json',
  'MyLibrary.json',
  'OneAndAHalf.json'
];

describe('E2E: Compiler integration', () => {
  describe('docker: inside out directory structure', () => {
    before(async () => {
      fsx.removeSync('test/projects/insideOut/build');
      process.chdir('test/projects/insideOut/main');
    });

    it('compile and produce artefacts', async () => {
      await compile('config_docker.json');
      for (const artefact of artefacts) {
        const filePath = join('../build', artefact);
        expect(isFile(filePath), `Expected compilation artefact "${filePath}" to exist.`).to.be.true;
      }
    });

    after(async () => {
      process.chdir('../../../..');
    });
  });

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
          expect(content.evm.bytecode.object).to.startWith('60');
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

      it('links library', async () => {
        const provider = createMockProvider();
        const [wallet] = await getWallets(provider);
        const libraryPath = resolve(join(configuration.targetPath, 'MyLibrary.json'));
        const MyLibrary = require(libraryPath);
        const LibraryConsumer = deepCopy(require(resolve(join(configuration.targetPath, 'Two.json'))));
        const myLibrary = await deployContract(wallet, MyLibrary, []);
        const libraryName = `${configuration.sourcesPath.slice(2)}/MyLibrary.sol:MyLibrary`;
        link(LibraryConsumer, libraryName, myLibrary.address);
        const libraryConsumer = await deployContract(wallet, LibraryConsumer, []);
        expect(await libraryConsumer.useLibrary(3)).to.eq(10);
      });
    });
  }
});
