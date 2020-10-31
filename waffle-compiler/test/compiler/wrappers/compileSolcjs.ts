import sinon, {SinonSpy} from 'sinon';
import {assert, expect} from 'chai';
import path from 'path';
import https from 'https';
import solc from 'solc';
import {loadCompiler} from '../../../src/compileSolcjs';
import {Config} from '../../../src/config';
import {isDirectory} from '../../../src/utils';
import rimraf from 'rimraf';
import fs from 'fs-extra';

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
    describe('for existing version', () => {
      const cacheDirectory = path.join(__dirname, 'cache');
      let httpsGet: SinonSpy;

      beforeEach(() => {
        assert.isFalse(
          fs.pathExistsSync(cacheDirectory),
          `${path.resolve(cacheDirectory)} should be removed before running tests`
        );
        httpsGet = sinon.spy(https, 'get');
      });

      afterEach(() => {
        httpsGet.restore();
        if (isDirectory(cacheDirectory)) {
          rimraf.sync(cacheDirectory);
        }
      });

      it('loads compiler from a remote server', async () => {
        const solcLoaded = await loadCompiler(
          {compilerVersion: '0.7.0', cacheDirectory} as Config
        );
        expect(solcLoaded.version()).to.startWith('0.7.0+commit');
        expect(httpsGet).to.have.been.calledOnce;
      });

      it('caches the loaded compiler and fetches from cache on subsequent calls', async () => {
        await loadCompiler(
          {compilerVersion: '0.7.0', cacheDirectory} as Config
        );
        const solcCached = await loadCompiler(
          {compilerVersion: '0.7.0', cacheDirectory} as Config
        );
        expect(solcCached.version()).to.startWith('0.7.0+commit');
        expect(httpsGet).to.have.been.calledOnce;
      });
    });

    describe('for a nonexistent version', () => {
      it('throws an error', async () => {
        await expect(
          loadCompiler(
            {compilerVersion: '999.999.999'} as Config
          )
        ).to.be.rejectedWith('Error fetching compiler version: 999.999.999');
      });
    });
  });

  describe('when a solcVersion is given', () => {
    describe('for existing version', () => {
      const cacheDirectory = path.join(__dirname, 'cache');
      let httpsGet: SinonSpy;

      beforeEach(() => {
        assert.isFalse(
          fs.pathExistsSync(cacheDirectory),
          `${path.resolve(cacheDirectory)} should be removed before running tests`
        );
        httpsGet = sinon.spy(https, 'get');
      });

      afterEach(() => {
        httpsGet.restore();
        if (isDirectory(cacheDirectory)) {
          rimraf.sync(cacheDirectory);
        }
      });

      it('loads compiler from a remote server', async () => {
        const solcLoaded = await loadCompiler(
          {compilerVersion: 'v0.5.9+commit.e560f70d', cacheDirectory} as Config
        );
        expect(solcLoaded.version()).to.equal('0.5.9+commit.e560f70d.Emscripten.clang');
        expect(httpsGet).to.have.been.calledOnce;
      });

      it('caches the loaded compiler and fetches from cache on subsequent calls', async () => {
        await loadCompiler(
          {compilerVersion: 'v0.5.9+commit.e560f70d', cacheDirectory} as Config
        );
        const solcCached = await loadCompiler(
          {compilerVersion: 'v0.5.9+commit.e560f70d', cacheDirectory} as Config
        );
        expect(solcCached.version()).to.equal('0.5.9+commit.e560f70d.Emscripten.clang');
        expect(httpsGet).to.have.been.calledOnce;
      });
    });

    describe('for a nonexistent version', () => {
      it('throws an error', async () => {
        await expect(
          loadCompiler(
            {compilerVersion: '999.999.999+commit.deadbeef'} as Config
          )
        ).to.be.rejectedWith('Error fetching compiler version: 999.999.999+commit.deadbeef');
      });
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
