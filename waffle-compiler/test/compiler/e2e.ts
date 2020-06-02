import fs from 'fs';
import fsx from 'fs-extra';
import {join, resolve, dirname, basename} from 'path';
import {expect} from 'chai';
import {compileProject} from '../../src/compiler';
import {loadConfig} from '../../src/config';
import {readFileContent, isFile} from '../../src/utils';
import {link} from '../../src';
import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';

const configurations = [
  './test/projects/solidity4/config_docker.json',
  './test/projects/solidity4/config_solcjs.json',
  './test/projects/solidity4/config_solcjs_commit.json',
  './test/projects/solidity5/config_commonjs.js',
  './test/projects/solidity5/config_docker.json',
  './test/projects/solidity5/config_klab.json',
  './test/projects/solidity5/config_native.json',
  './test/projects/solidity5/config_promise.js',
  './test/projects/solidity5/config_solcjs.json',
  './test/projects/solidity5/config_solcjs_commit.json',
  './test/projects/solidity6/config_docker.json',
  './test/projects/solidity6/config_solcjs.json',
  './test/projects/solidity6/config_solcjs_commit.json'
];

const artifacts = [
  'Custom.json',
  'CustomSafeMath.json',
  'ERC20.json',
  'One.json',
  'Two.json',
  'MyLibrary.json',
  'OneAndAHalf.json'
];

describe('E2E: Compiler integration', async () => {
  describe('docker: inside out directory structure', () => {
    before(async () => {
      fsx.removeSync('test/projects/insideOut/build/nested');
      process.chdir('test/projects/insideOut/main');
    });

    it('compile and produce artifacts', async () => {
      await compileProject('config_docker.json');
      for (const artefact of artifacts) {
        const filePath = join('../build/nested', artefact);
        expect(isFile(filePath), `Expected compilation artefact "${filePath}" to exist.`).to.equal(true);
      }
    });

    after(async () => {
      process.chdir('../../../..');
    });
  });

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
          expect(content.evm.bytecode.object).to.startWith('60');
        }
      });

      it('produce legacy bytecode', async () => {
        for (const artefact of artifacts) {
          const filePath = join(outputDirectory, artefact);
          const content = JSON.parse(readFileContent(filePath));
          expect(content.bytecode).to.deep.eq(content.evm.bytecode.object);
        }
      });

      if (['all', 'combined'].includes(configuration.outputType)) {
        it('produce Combined-Json.json', async () => {
          const filePath = join(outputDirectory, 'Combined-Json.json');
          const content = JSON.parse(readFileContent(filePath));
          expect(content).to.have.property('contracts');
          expect(content).to.have.property('sources');
          expect(content).to.have.property('sourceList');
        });
      }

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

      const deepCopy = (x: any) => JSON.parse(JSON.stringify(x));

      it('links library', async () => {
        const [wallet] = new MockProvider().getWallets();
        const libraryPath = resolve(configuration.outputDirectory, 'MyLibrary.json');
        const MyLibrary = require(libraryPath);
        const LibraryConsumer = deepCopy(require(resolve(configuration.outputDirectory, 'Two.json')));

        const libraryFactory = new ContractFactory(MyLibrary.abi, MyLibrary.evm.bytecode.object, wallet);
        const myLibrary = await libraryFactory.deploy();

        const libraryName = `${configuration.sourceDirectory.slice(2)}/MyLibrary.sol:MyLibrary`;
        link(LibraryConsumer, libraryName, myLibrary.address);

        const consumerFactory = new ContractFactory(LibraryConsumer.abi, LibraryConsumer.evm.bytecode.object, wallet);
        const libraryConsumer = await consumerFactory.deploy();

        expect(await libraryConsumer.useLibrary(3)).to.equal(10);
      });
    });
  }
});
