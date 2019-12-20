import {expect} from 'chai';
import {flattenObjectArray, isDirectory} from '../src/utils';

describe('UNIT: Utils', () => {
  describe('flattenObjectArray', () => {
    it('empty array', async () => {
      expect(flattenObjectArray([])).to.deep.eq({});
    });

    it('one element', async () => {
      expect(flattenObjectArray([{ab: 1}])).to.deep.eq({ab: 1});
    });

    it('multiple elements', async () => {
      expect(flattenObjectArray([{ab: 1}, {cb: 2}, {dd: 4}])).to.deep.eq({ab: 1, cb: 2, dd: 4});
    });
  });

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
});
