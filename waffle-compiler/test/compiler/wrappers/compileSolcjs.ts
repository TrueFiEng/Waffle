import {expect} from 'chai';
import {loadCompiler} from '../../../src/compileSolcjs';
import solc from 'solc';
import {Config} from '../../../src/config';

describe('INTEGRATION: loadCompiler', () => {
  describe('when \'default\' is given as version', () => {
    it('loads compiler without a download', async () => {
      const solcLoaded = await loadCompiler(
        {compilerVersion: 'default'} as Config
      );
      expect(solcLoaded).to.equal(solc);
    });
  });

  describe('when the default semver version is given', () => {
    it('loads compiler without a download', async () => {
      const version = solc.version().split('+')[0];
      const solcLoaded = await loadCompiler(
        {compilerVersion: version} as Config
      );
      expect(solcLoaded).to.equal(solc);
    });
  });

  describe('when a non-default semver version is given', () => {
    it('loads compiler for existing version', async () => {
      const solcLoaded = await loadCompiler(
        {compilerVersion: '0.7.0'} as Config
      );
      expect(solcLoaded.version()).to.startWith('0.7.0+commit');
    });

    it('throws an error for nonexistent version', async () => {
      await expect(
        loadCompiler(
          {compilerVersion: '999.999.999'} as Config
        )
      ).to.be.rejectedWith('Error fetching compiler version: 999.999.999');
    });
  });

  describe('when a solcVersion is given', () => {
    it('loads compiler for existing version', async () => {
      const solcLoaded = await loadCompiler(
        {compilerVersion: 'v0.5.9+commit.e560f70d'} as Config
      );
      expect(solcLoaded.version()).to.equal('0.5.9+commit.e560f70d.Emscripten.clang');
    });

    it('throws an error for nonexistent version', async () => {
      await expect(
        loadCompiler(
          {compilerVersion: '999.999.999+commit.deadbeef'} as Config
        )
      ).to.be.rejectedWith('Error fetching compiler version: 999.999.999+commit.deadbeef');
    });
  });

  describe('when a path is given', () => {
    it('loads compiler if path exists', async () => {
      const solcLoaded = await loadCompiler(
        {compilerVersion: '../node_modules/solc'} as Config
      );
      expect(solcLoaded.version()).to.equal(solc.version());
    });

    it('throws an error for nonexistent path', async () => {
      await expect(
        loadCompiler(
          {compilerVersion: './nonexistent/path'} as Config
        )
      ).to.be.rejectedWith('Error fetching compiler version: ./nonexistent/path');
    });
  });
});
