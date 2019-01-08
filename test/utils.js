import chai from 'chai';
import {falttenObjectArray} from '../lib/utils';
const {expect} = chai;

describe('UNIT: Utils', () => {
  describe('falttenObjectArray', () => {
    it('empty array', async () => {
      expect(falttenObjectArray([])).to.deep.eq({});
    });

    it('one element', async () => {
      expect(falttenObjectArray([{ab: 1}])).to.deep.eq({ab: 1});
    });

    it('multiple elements', async () => {
      expect(falttenObjectArray([{ab: 1}, {cb: 2}, {dd: 4}])).to.deep.eq({ab: 1, cb: 2, dd: 4});
    });
  });
});
