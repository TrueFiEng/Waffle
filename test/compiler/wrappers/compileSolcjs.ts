import {expect} from 'chai';
import {findInputs, loadCompiler} from '../../../lib/compiler/compileSolcjs';
import {readFileContent} from '../../../lib/utils';
import solc from 'solc';

const expectedInputs = [
  'test/projects/example/BasicToken.sol',
  'test/projects/example/ERC20Basic.sol',
  'test/projects/example/mock/BasicTokenMock.sol'
];

const requiredInputs = {
  sourcesPath: 'test', npmPath: 'test'
};

describe('INTEGRITY: findInputs', () => {
  it('findInputs', async () => {
    const actualInputs = findInputs(expectedInputs);
    expect(Object.keys(actualInputs)).to.deep.eq(expectedInputs);
    const basicTokenContractActual = actualInputs['test/projects/example/BasicToken.sol'];
    const basicTokenContractExpected = await readFileContent('test/projects/example/BasicToken.sol');
    expect(basicTokenContractActual).to.deep.eq(basicTokenContractExpected);
  });
});

describe('INTEGRITY: loadCompiler', () => {
  it('loadCompiler with solcVersion as version', async () => {
    const solcLoaded = await loadCompiler({solcVersion: 'v0.5.9+commit.e560f70d', ...requiredInputs});
    expect(solcLoaded.version()).to.eq('0.5.9+commit.e560f70d.Emscripten.clang');
  });

  it('loadCompiler with solcVersion as path', async () => {
    const solcLoaded = await loadCompiler({solcVersion: 'node_modules/solc', ...requiredInputs});
    expect(solcLoaded.version()).to.eq(solc.version());
  });

  it('loadCompier without solcVersion', async () => {
    const solcLoaded = await loadCompiler(requiredInputs);
    expect(solcLoaded.version()).to.eq(solc.version());
  });
});
