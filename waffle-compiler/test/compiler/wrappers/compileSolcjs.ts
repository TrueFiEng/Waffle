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

  it('loadCompiler with a semver version as version', async () => {
    const solcLoaded = await loadCompiler(
      {compilerVersion: '0.7.0'} as Config
    );
    expect(solcLoaded.version()).to.startWith('0.7.0+commit');
  });

  it('loadCompiler without the download', async () => {
    const version = solc.version().split('+')[0];
    const solcLoaded = await loadCompiler(
      {compilerVersion: version} as Config
    );
    expect(solcLoaded).to.equal(solc);
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
