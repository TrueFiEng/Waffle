import chai, {expect} from 'chai';
import chaiString from 'chai-string';
import NativeWrapper from '../../../lib/wrappers/nativeWrapper';

chai.use(chaiString);

const sourcesPath = './test/projects/custom/custom_contracts';
const npmPath = './test/projects/custom/custom_node_modules';
const config = {sourcesPath, npmPath};

describe('UNIT: NativeWrapper', () => {
  let wrapper: NativeWrapper;

  before(() => {
    wrapper = new NativeWrapper(config);
  });

  it('buildCommand', async () => {
    const expectedPrefix = 'solc --standard-json --allow-paths';
    const expectedSuffix = 'test/projects/custom/custom_node_modules';
    const actualCommand = wrapper.buildCommand();
    expect(actualCommand).to.startWith(expectedPrefix);
    expect(actualCommand).to.endWith(expectedSuffix);
  });
});
