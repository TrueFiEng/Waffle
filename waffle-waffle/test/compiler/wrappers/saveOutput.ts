import {expect} from 'chai';
import sinon from 'sinon';
import {readFileContent} from '../../../src/utils';
import {saveOutput} from '../../../src/compiler/saveOutput';

const sourcesPath = './test/projects/custom/custom_contracts';
const npmPath = './test/projects/custom/custom_node_modules';
const targetPath = './buildtmp';
const config = {sourcesPath, npmPath, targetPath};

describe('UNIT: saveOutput', () => {
  it('calls the required fs methods', () => {
    const fsOps = {
      writeFile: sinon.spy(),
      createDirectory: sinon.spy()
    };
    const output = JSON.parse(readFileContent('./test/compiler/wrappers/compilerOutput.json'));
    saveOutput(output, config, fsOps);
    const expectedContent = JSON.stringify(output.contracts['One.sol'].One, null, 2);
    expect(fsOps.createDirectory).to.be.calledWith('./buildtmp');
    expect(fsOps.writeFile).to.be.calledWith('buildtmp/One.json', expectedContent);
  });
});
