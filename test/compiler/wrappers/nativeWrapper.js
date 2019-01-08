import chai, {expect} from 'chai';
import NativeWrapper from '../../../lib/wrappers/nativeWrapper';

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
    const expectedPrefix = 'solc --standard-json --allow-paths';
    const expectedSuffix = 'test/compiler/custom/custom_node_modules';
    const sources = ['./test/compiler/custom/custom_contracts/Custom.sol'];
    const actualCommand = wrapper.buildCommand(sources, './waffle-tmp');
    expect(actualCommand).to.startWith(expectedPrefix);
    expect(actualCommand).to.endWith(expectedSuffix);
  });
});
