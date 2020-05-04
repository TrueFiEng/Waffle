import {expect} from 'chai';
import {isDirectory} from '../src/utils';

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
});
