import {expect} from 'chai';
import sinon from 'sinon';
import {readFileContent} from '../../../src/utils';
import {saveOutput} from '../../../src/saveOutput';
import {Config} from '../../../src/config';

const sourceDirectory = './test/projects/custom/custom_contracts';
const nodeModulesDirectory = './test/projects/custom/custom_node_modules';
const outputDirectory = './buildtmp';
const config = {
  sourceDirectory,
  nodeModulesDirectory,
  outputDirectory
};

describe('UNIT: saveOutput', () => {
  it('calls the required fs methods', () => {
    const fsOps = {
      writeFile: sinon.spy(),
      createDirectory: sinon.spy()
    };
    const output = JSON.parse(readFileContent('./test/compiler/wrappers/compilerOutput.json'));
    saveOutput(output, config as Config, fsOps);
    const expectedContent = JSON.stringify(output.contracts['One.sol'].One, null, 2);
    expect(fsOps.createDirectory).to.be.calledWith('./buildtmp');
    expect(fsOps.writeFile).to.be.calledWith('buildtmp/One.json', expectedContent);
  });
});
