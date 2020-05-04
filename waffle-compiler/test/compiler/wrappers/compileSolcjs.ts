import {expect} from 'chai';
import {loadCompiler} from '../../../src/compileSolcjs';
import solc from 'solc';
import {Config} from '../../../src/config';

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
