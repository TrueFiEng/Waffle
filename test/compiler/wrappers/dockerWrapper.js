import chai, {expect} from 'chai';
import DockerWrapper from '../../../lib/wrappers/dockerWrapper';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const inputs = ['test/projects/custom/custom_contracts/Custom.sol',
  'test/projects/custom/custom_contracts/sub/One.sol',
  'test/projects/custom/custom_contracts/sub/Two.sol'];
const sourcesPath = './test/projects/custom/custom_contracts';
const npmPath = './test/projects/custom/custom_node_modules';
const config = {sourcesPath, npmPath};

describe('UNIT: DockerWrapper', () => {
  let dockerWrapper;

  before(() => {
    dockerWrapper = new DockerWrapper(config);
  });

  describe('getVolumes', () => {
    it('simple config', () => {
      const suffix = '/home/project';
      const prefix = process.cwd();
      expect(dockerWrapper.getVolumes()).to.eq(`${prefix}:${suffix}`);
    });
  });

  describe('buildInputJson', () => {
    it('empty sources', () => {
      expect(dockerWrapper.buildInputJson([])).to.deep.eq({
        language: 'Solidity',
        sources: {},
        settings: {
          remappings: [],
          outputSelection: {'*': {'*': ['metadata', 'evm.bytecode']}}
        }
      });
    });

    it('example sources', () => {
      const prefix = '/home/project/';
      expect(dockerWrapper.buildInputJson(inputs)).to.deep.eq({
        language: 'Solidity',
        sources: {
          'test/projects/custom/custom_contracts/Custom.sol': {urls: [`${prefix}${inputs[0]}`]},
          'test/projects/custom/custom_contracts/sub/One.sol': {urls: [`${prefix}${inputs[1]}`]},
          'test/projects/custom/custom_contracts/sub/Two.sol': {urls: [`${prefix}${inputs[2]}`]}
        },
        settings: {
          remappings: ['openzeppelin-solidity=/home/project/test/projects/custom/custom_node_modules/openzeppelin-solidity'],
          outputSelection: {'*': {'*': ['metadata', 'evm.bytecode']}}
        }
      });
    });
  });

  describe('buildCommand', () => {
    it('no version', () => {
      const command = dockerWrapper.buildCommand();
      expect(command).to.startWith('docker run -v');
      expect(command).to.endWith(':/home/project -i -a stdin -a stdout ethereum/solc:stable solc --standard-json --allow-paths "/home/project"');
    });

    it('specific version', () => {
      const dockerWrapper = new DockerWrapper({...config, 'docker-tag': '0.4.24'});
      const command = dockerWrapper.buildCommand();
      expect(command).to.startWith('docker run -v');
      expect(command).to.endWith(':/home/project -i -a stdin -a stdout ethereum/solc:0.4.24 solc --standard-json --allow-paths "/home/project"');
    });
  });
});
