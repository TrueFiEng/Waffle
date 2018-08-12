import chai from 'chai';
import {arrayIntersection, eventParseResultToArray, isWarningMessage} from '../../lib/utils';

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

  describe('eventParseResultToArray', () => {
    it('Empty to empty', async () => {
      const parseResults = {};
      expect(eventParseResultToArray(parseResults)).to.deep.eq([]);
    });

    it('Common case', async () => {
      const parseResults = {0: 0,
        1: 'One',
        value: 0,
        msg: 'One',
        length: 2};
      expect(eventParseResultToArray(parseResults)).to.deep.eq([0, 'One']);
    });
  });

  describe('isWarningMessage', () => {
    const warningMessage = 'test/matchers/contracts/matchers.sol:10:9: Warning: "throw" is deprecated in favour of "revert()", "require()" and "assert()".\n        throw;\n        ^---^\n';
    const errorMessage = 'test/matchers/contracts/matchers.sol:10:9: Error: "throw" is deprecated in favour of "revert()", "require()" and "assert()".\n        throw;\n        ^---^\n';

    it('warning message', async () => {
      expect(isWarningMessage(warningMessage)).to.be.true;
    });

    it('error message', async () => {
      expect(isWarningMessage(errorMessage)).to.be.false;
    });
  });
});
