import chai, {expect} from 'chai';
import {readFileContent} from '../../../lib/utils';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {saveOutput} from '../../../lib/compiler/saveOutput';

chai.use(sinonChai);

const sourcesPath = './test/projects/custom/custom_contracts';
const npmPath = './test/projects/custom/custom_node_modules';
const targetPath = './buildtmp';
const config = {sourcesPath, npmPath, targetPath};

describe('UNIT: saveOutput', () => {
  it('calls the required fs methods', () => {
    const fs = {
      writeFileSync: sinon.spy(),
      existsSync: sinon.spy(),
      mkdirSync: sinon.spy()
    };
    const output = JSON.parse(readFileContent('./test/compiler/wrappers/compilerOutput.json'));
    saveOutput(output, config, fs as any);
    const expectedContent = JSON.stringify(output.contracts['One.sol'].One, null, 2);
    expect(fs.writeFileSync).to.be.calledWith('buildtmp/One.json', expectedContent);
  });
});
