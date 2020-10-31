import {assert, expect} from 'chai';
import {insert, isDirectory, removeEmptyDirsRecursively} from '../src/utils';
import fs from 'fs-extra';
import * as path from 'path';

describe('UNIT: Utils', () => {
  describe('INTEGRATION: isDirectory', () => {
    it('valid directory path', () => {
      expect(isDirectory('test')).to.be.true;
    });

    it('file path as directory path', () => {
      expect(isDirectory('test/utils.ts')).to.be.false;
    });

    it('invalid directory path', () => {
      expect(isDirectory('123')).to.be.false;
    });
  });

  describe('INTEGRATION: removeEmptyDirsRecursively', () => {
    const testDir = path.join(__dirname, 'tmp-dir');

    beforeEach(() => {
      assert.isFalse(fs.pathExistsSync(testDir), `${path.resolve(testDir)} should be removed before running tests`);
      fs.mkdirpSync(testDir);
    });

    afterEach(() => {
      fs.removeSync(testDir);
    });

    describe('when there are no files in the directory structure', () => {
      it('removes an empty directory', () => {
        removeEmptyDirsRecursively(testDir);
        expect(fs.pathExistsSync(testDir)).to.be.false;
      });

      it('removes a directory with subdirs', () => {
        fs.mkdirpSync(path.join(testDir, 'a/b/c'));
        fs.mkdirpSync(path.join(testDir, 'a/d'));

        removeEmptyDirsRecursively(testDir);
        expect(fs.pathExistsSync(testDir)).to.be.false;
      });
    });

    describe('when there are files in the directory structure', () => {
      it('does not remove a non-empty directory', () => {
        const file = path.join(testDir, 'file.txt');
        fs.writeFileSync(file, '');

        removeEmptyDirsRecursively(testDir);
        expect(fs.pathExistsSync(file)).to.be.true;
      });

      it('does not remove a directory with a non-empty subdir', () => {
        const subdir = path.join(testDir, 'subdir');
        const file = path.join(testDir, 'subdir', 'file.txt');
        fs.mkdirpSync(subdir);
        fs.writeFileSync(file, '');

        removeEmptyDirsRecursively(testDir);
        expect(fs.pathExistsSync(file)).to.be.true;
      });

      it('removes all empty subdirs', () => {
        const subdirA = path.join(testDir, 'subdirA');
        const subdirB = path.join(testDir, 'subdirB');
        const subdirC = path.join(testDir, 'subdirC');
        const subdirCD = path.join(testDir, 'subdirC', 'subdirCD');
        const fileA = path.join(testDir, 'subdirA', 'fileA.txt');
        fs.mkdirpSync(subdirA);
        fs.mkdirpSync(subdirB);
        fs.mkdirpSync(subdirCD);
        fs.writeFileSync(fileA, '');

        removeEmptyDirsRecursively(testDir);
        expect(fs.pathExistsSync(fileA)).to.be.true;
        expect(fs.pathExistsSync(subdirB)).to.be.false;
        expect(fs.pathExistsSync(subdirC)).to.be.false;
      });
    });
  });

  it('insert pastes string into another string at index', () => {
    expect(insert('123789', '456', 3)).to.equal('123456789');
  });
});
