import chai from 'chai';
import {flattenObjectArray} from '../lib/utils';
const {expect} = chai;

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
});
