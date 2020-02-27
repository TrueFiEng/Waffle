import {expect} from 'chai';
import {findInputs, loadCompiler} from '../../../src/compileSolcjs';
import {readFileContent} from '../../../src/utils';
import solc from 'solc';
import {Config} from '../../../src/config';

const expectedInputs = [
  'test/projects/example/BasicToken.sol',
  'test/projects/example/ERC20Basic.sol',
  'test/projects/example/mock/BasicTokenMock.sol'
];

describe('INTEGRATION: findInputs', () => {
  it('findInputs', async () => {
    const actualInputs = findInputs(expectedInputs);
    expect(Object.keys(actualInputs)).to.deep.eq(expectedInputs);
    const basicTokenContractActual = actualInputs['test/projects/example/BasicToken.sol'];
    const basicTokenContractExpected = await readFileContent('test/projects/example/BasicToken.sol');
    expect(basicTokenContractActual).to.deep.eq(basicTokenContractExpected);
  });
});

describe('INTEGRATION: loadCompiler', () => {
  it('loadCompiler with solcVersion as version', async () => {
    const solcLoaded = await loadCompiler(
      {compilerVersion: 'v0.5.9+commit.e560f70d'} as Config
    );
    expect(solcLoaded.version()).to.equal('0.5.9+commit.e560f70d.Emscripten.clang');
  });

  it('loadCompiler with solcVersion as path', async () => {
    const solcLoaded = await loadCompiler(
      {compilerVersion: '../node_modules/solc'} as Config
    );
    expect(solcLoaded.version()).to.equal(solc.version());
  });

  it('loadCompier without solcVersion', async () => {
    const solcLoaded = await loadCompiler(
      {compilerVersion: 'default'} as Config
    );
    expect(solcLoaded.version()).to.equal(solc.version());
  });
});
