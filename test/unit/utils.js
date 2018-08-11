import chai from 'chai';
import {arrayIntersection} from '../../lib/utils';

const {expect} = chai;

describe('Utils', () => {
  describe('Array intersection', () => {
    it('Empty if disjoint', async () => {
      expect(arrayIntersection([1, 2], [3, 4])).to.deep.eq([]);
    });

    it('Same if equal', async () => {
      expect(arrayIntersection([1, 2], [1, 2])).to.deep.eq([1, 2]);
    });

    it('Intersection if intersect', async () => {
      expect(arrayIntersection([1, 2], [2, 3])).to.deep.eq([2]);
    });
  });
});
