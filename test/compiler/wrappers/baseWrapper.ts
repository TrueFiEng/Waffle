import chai, {expect} from 'chai';
import BaseWrapper from '../../../lib/wrappers/baseWrapper';
import {readFileContent} from '../../../lib/utils';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const sourcesPath = './test/projects/custom/custom_contracts';
const npmPath = './test/projects/custom/custom_node_modules';
const config = {sourcesPath, npmPath};

describe('UNIT: BaseWrapper', () => {
  let wrapper: BaseWrapper;

  before(() => {
    wrapper = new BaseWrapper(config);
  });

  it('saveOutput', () => {
    const fs = {
      writeFileSync: sinon.spy(),
      existsSync: sinon.spy(),
      mkdirSync: sinon.spy()
    };
    const output = JSON.parse(readFileContent('./test/compiler/wrappers/compilerOutput.json'));
    wrapper.saveOutput(output, './buildtmp', fs as any);
    const expectedContent = JSON.stringify(output.contracts['One.sol'].One, null, 2);
    expect(fs.writeFileSync).to.be.calledWith('buildtmp/One.json', expectedContent);
  });
});
