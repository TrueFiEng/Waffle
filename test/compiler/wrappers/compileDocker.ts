import chai, {expect} from 'chai';
import {
  getVolumes,
  buildInputJson,
  createBuildCommand
} from '../../../lib/compiler/compileDocker';
import sinonChai from 'sinon-chai';
import {join} from 'path';

chai.use(sinonChai);

const inputs = ['test/projects/custom/custom_contracts/Custom.sol',
  'test/projects/custom/custom_contracts/sub/One.sol',
  'test/projects/custom/custom_contracts/sub/Two.sol'];
const sourcesPath = './test/projects/custom/custom_contracts';
const npmPath = './test/projects/custom/custom_node_modules';
const config = {sourcesPath, npmPath};

describe('UNIT: DockerWrapper', () => {
  describe('getVolumes', () => {
    it('simple config', () => {
      const hostProjectPath = process.cwd();
      const hostNpmPath = join(hostProjectPath, npmPath);
      const expectedVolumes = `-v ${hostProjectPath}:/home/project -v ${hostNpmPath}:/home/npm`;
      expect(getVolumes(config)).to.eq(expectedVolumes);
    });
  });

  describe('buildInputJson', () => {
    it('empty sources', () => {
      expect(buildInputJson([], config)).to.deep.eq({
        language: 'Solidity',
        sources: {},
        settings: {
          remappings: [],
          outputSelection: {'*': {'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']}}
        }
      });
    });

    it('example sources', () => {
      const prefix = '/home/project/';
      expect(buildInputJson(inputs, config)).to.deep.eq({
        language: 'Solidity',
        sources: {
          'test/projects/custom/custom_contracts/Custom.sol': {urls: [`${prefix}${inputs[0]}`]},
          'test/projects/custom/custom_contracts/sub/One.sol': {urls: [`${prefix}${inputs[1]}`]},
          'test/projects/custom/custom_contracts/sub/Two.sol': {urls: [`${prefix}${inputs[2]}`]}
        },
        settings: {
          remappings: ['openzeppelin-solidity=/home/npm/openzeppelin-solidity'],
          outputSelection: {'*': {'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']}}
        }
      });
    });
  });

  describe('buildCommand', () => {
    it('no version', () => {
      const command = createBuildCommand(config);
      expect(command).to.startWith('docker run -v ');
      expect(command).to.endWith(
        ':/home/npm -i -a stdin -a stdout ethereum/solc:stable solc ' +
        '--standard-json --allow-paths "/home/project,/home/npm"'
      );
    });

    it('specific version', () => {
      const command = createBuildCommand({...config, 'docker-tag': '0.4.24'});
      expect(command).to.startWith('docker run -v ');
      expect(command).to.endWith(
        ':/home/npm -i -a stdin -a stdout ethereum/solc:0.4.24 solc ' +
        '--standard-json --allow-paths "/home/project,/home/npm"'
      );
    });
  });
});
