import chai, {expect} from 'chai';
import NativeWrapper from '../../../lib/wrappers/nativeWrapper';
import {isDirectory} from '../../../lib/utils';

chai.use(require('chai-string'));

const sourcesPath = './test/compiler/custom/custom_contracts';
const npmPath = './test/compiler/custom/custom_node_modules';
const config = {sourcesPath, npmPath};

describe('UNIT: NativeWrapper', () => {
  let wrapper;

  before(() => {
    wrapper = new NativeWrapper(config);
  });

  it('buildCommand', async () => {
    const expectedPrefix = 'solc --combined-json abi,asm,ast,bin,bin-runtime,compact-format,devdoc,hashes,interface,metadata,opcodes,srcmap,srcmap-runtime,userdoc ./test/compiler/custom/custom_contracts/Custom.sol';
    const expectedSuffix = '-o ./waffle-tmp';
    const sources = ['./test/compiler/custom/custom_contracts/Custom.sol'];
    const actualCommand = wrapper.buildCommand(sources, './waffle-tmp');
    expect(actualCommand).to.startWith(expectedPrefix);
    expect(actualCommand).to.endWith(expectedSuffix);
  });

  it('create and clean tmp folder', async () => {
    expect(wrapper.createTemporaryFolderPath()).to.match(/^.\/waffle-tmp[0-9a-zA-z]*$/);
    expect(wrapper.getTemporaryOutputFilePath()).to.match(/^.\/waffle-tmp[0-9a-zA-z]*\/combined\.json$/);
    expect(isDirectory(wrapper.tmpPath)).to.be.true;
    wrapper.removeTemporaryDirectory();
    expect(isDirectory(wrapper.tmpPath)).to.be.false;
  });
});
