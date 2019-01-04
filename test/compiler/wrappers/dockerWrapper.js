import chai, {expect} from 'chai';
import DockerWrapper from '../../../lib/wrappers/dockerWrapper';
import {readFileContent} from '../../../lib/utils';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const inputs = ['test/compiler/custom/custom_contracts/Custom.sol',
  'test/compiler/custom/custom_contracts/sub/One.sol',
  'test/compiler/custom/custom_contracts/sub/Two.sol'];
const sourcesPath = './test/compiler/custom/custom_contracts';
const npmPath = './test/compiler/custom/custom_node_modules';
const config = {sourcesPath, npmPath};

describe('DockerWrapper', () => {
  let dockerWrapper;

  before(() => {
    dockerWrapper = new DockerWrapper(config);
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
          'Custom.sol': {urls: [`${prefix}${inputs[0]}`]},
          'One.sol': {urls: [`${prefix}${inputs[1]}`]},
          'Two.sol': {urls: [`${prefix}${inputs[2]}`]}
        },
        settings: {
          remappings: ['openzeppelin-solidity=/home/project/test/compiler/custom/custom_node_modules/openzeppelin-solidity'],
          outputSelection: {'*': {'*': ['metadata', 'evm.bytecode']}}
        }
      });
    });
  });

  it('buildCommand', () => {
    const command = dockerWrapper.buildCommand();
    expect(command).to.startWith('docker run -v');
    expect(command).to.endWith(':/home/project -i -a stdin -a stdout ethereum/solc:stable solc --standard-json --allow-paths /home/project');
  });

  it('saveOutput', () => {
    const fs = {
      writeFileSync: sinon.spy(),
      existsSync: sinon.spy(),
      mkdirSync: sinon.spy()
    };
    const output = JSON.parse(readFileContent('./test/compiler/wrappers/compilerOutput.json'));
    dockerWrapper.saveOutput(output, './buildtmp', fs);
    const expectedContent = JSON.stringify(output.contracts['One.sol'].One);
    expect(fs.writeFileSync).to.be.calledWith('buildtmp/One.json', expectedContent);
  });
});
