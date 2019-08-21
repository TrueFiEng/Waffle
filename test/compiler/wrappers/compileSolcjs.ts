import {expect} from 'chai';
import {findInputs, loadCompiler} from '../../../lib/compiler/compileSolcjs';
import {readFileContent} from '../../../lib/utils';

const expectedInputs = [
  'test/projects/example/BasicToken.sol',
  'test/projects/example/ERC20Basic.sol',
  'test/projects/example/mock/BasicTokenMock.sol'
];

describe('UNIT: findInputs', () => {
  it('findInputs', async () => {
    const actualInputs = findInputs(expectedInputs);
    expect(Object.keys(actualInputs)).to.deep.eq(expectedInputs);
    const basicTokenContractActual = actualInputs['test/projects/example/BasicToken.sol'];
    const basicTokenContractExpected = await readFileContent('test/projects/example/BasicToken.sol');
    expect(basicTokenContractActual).to.deep.eq(basicTokenContractExpected);
  });
});

describe('UNIT: loadCompiler', () => {
  it('loadCompiler with solcVersion as version', async () => {
    const solc = await loadCompiler({solcVersion: 'v0.5.9+commit.e560f70d', sourcesPath: 'test', npmPath: 'test'});
    expect(solc.version()).to.eq('0.5.9+commit.e560f70d.Emscripten.clang');
  });

  it('loadCompiler with solcVersion as path', async () => {
    const solc = await loadCompiler({solcVersion: 'node_modules/solc', sourcesPath: 'test', npmPath: 'test'});
    expect(solc.version()).to.eq('0.5.11+commit.c082d0b4.Emscripten.clang');
  });

  it('loadCompier without solcVersion', async () => {
    const solc = await loadCompiler({sourcesPath: 'test', npmPath: 'test'});
    expect(solc.version()).to.eq('0.5.11+commit.c082d0b4.Emscripten.clang');
  });
});
