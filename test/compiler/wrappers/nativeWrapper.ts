import chai, {expect} from 'chai';
import chaiString from 'chai-string';
import NativeWrapper from '../../../lib/compiler/nativeWrapper';

chai.use(chaiString);

const sourcesPath = './test/projects/custom/custom_contracts';
const npmPath = './test/projects/custom/custom_node_modules';
const config = {sourcesPath, npmPath};

describe('UNIT: NativeWrapper', () => {

  it('buildCommand', async () => {
    const wrapper = new NativeWrapper(config);
    const actualCommand = wrapper.buildCommand();
    const expectedCommand = 'solc --standard-json --allow-paths ' +
      '.*test/projects/custom/custom_contracts,.*/test/projects/custom/custom_node_modules';
    expect(actualCommand).to.match(new RegExp(expectedCommand));
  });

  it('buildCommand with custom allow_paths', async () => {
    const configWithAllowedPaths = {...config, allowedPaths: ['some/random/path', './yet/another/path']};
    const wrapper = new NativeWrapper(configWithAllowedPaths);
    const actualCommand = wrapper.buildCommand();
    const expectedCommand = 'solc --standard-json --allow-paths ' +
      '.*test/projects/custom/custom_contracts,.*/test/projects/custom/custom_node_modules' +
      ',.*/some/random/path.*/yet/another/path';
    expect(actualCommand).to.match(new RegExp(expectedCommand));
  });
});
