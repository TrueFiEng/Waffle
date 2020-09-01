import {BigNumber} from 'ethers';

describe('UNIT: BigNumber matchers', () => {
  function checkAll(
    actual: number,
    expected: number,
    test: (
      actual: number | string | BigNumber,
      expected: number | string | BigNumber
    ) => void
  ) {
    test(actual, expected);
    test(BigNumber.from(actual), expected);
    test(BigNumber.from(actual), expected.toString());
    test(BigNumber.from(actual), BigNumber.from(expected));
    test(actual, BigNumber.from(expected));
    test(actual.toString(), BigNumber.from(expected));
  }

  describe('equal', () => {
    it('.toEqBN', () => {
      checkAll(10, 10, (a, b) => expect(a).toEqBN(b));
    });

    it('.not.toEqBN', () => {
      checkAll(10, 11, (a, b) => expect(a).not.toEqBN(b));
    });

    it('throws proper message on error', () => {
      expect(() => expect(BigNumber.from(10)).toEqBN(11)).toThrowError(
        'Expected "10" to be equal 11'
      );
    });
  });

  describe('greater than', () => {
    it('.toBeGtBN', () => {
      checkAll(10, 9, (a, b) => expect(a).toBeGtBN(b));
    });

    it('.not.toBeGtBN', () => {
      checkAll(10, 10, (a, b) => expect(a).not.toBeGtBN(b));
      checkAll(10, 11, (a, b) => expect(a).not.toBeGtBN(b));
    });

    it('throws proper message on error', () => {
      expect(() => expect(BigNumber.from(10)).toBeGtBN(11)).toThrowError(
        'Expected "10" to be greater than 11'
      );
    });
  });

  describe('less than', () => {
    it('.toBeLtBN', () => {
      checkAll(10, 11, (a, b) => expect(a).toBeLtBN(b));
    });

    it('.not.to.be.lt', () => {
      checkAll(10, 10, (a, b) => expect(a).not.toBeLtBN(b));
      checkAll(10, 9, (a, b) => expect(a).not.toBeLtBN(b));
    });

    it('throws proper message on error', () => {
      expect(() => expect(BigNumber.from(11)).toBeLtBN(10)).toThrowError(
        'Expected "11" to be less than 10'
      );
    });
  });

  describe('greater than or equal', () => {
    it('.toBeGteBN', () => {
      checkAll(10, 10, (a, b) => expect(a).toBeGteBN(b));
      checkAll(10, 9, (a, b) => expect(a).toBeGteBN(b));
    });

    it('.not.toBeGteBN', () => {
      checkAll(10, 11, (a, b) => expect(a).not.toBeGteBN(b));
    });

    it('throws proper message on error', () => {
      expect(() => expect(BigNumber.from(10)).toBeGteBN(11)).toThrowError(
        'Expected "10" to be greater than or equal 11'
      );
    });
  });

  describe('less than or equal', () => {
    it('.toBeLteBN', () => {
      checkAll(10, 10, (a, b) => expect(a).toBeLteBN(b));
      checkAll(10, 11, (a, b) => expect(a).toBeLteBN(b));
    });

    it('.not.toBeLteBN', () => {
      checkAll(10, 9, (a, b) => expect(a).not.toBeLteBN(b));
    });

    it('throws proper message on error', () => {
      expect(() => expect(BigNumber.from(11)).toBeLteBN(10)).toThrowError(
        'Expected "11" to be less than or equal 10'
      );
    });
  });
});
