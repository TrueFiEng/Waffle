import {utils} from 'ethers';

export function supportBigNumber(Assertion: Chai.AssertionStatic, utils: Chai.ChaiUtils) {
  Assertion.overwriteMethod('equal', override('eq', 'equal', utils));
  Assertion.overwriteMethod('eq', override('eq', 'equal', utils));
  Assertion.overwriteMethod('above', override('gt', 'above', utils));
  Assertion.overwriteMethod('below', override('lt', 'below', utils));
  Assertion.overwriteMethod('least', override('gte', 'at least', utils));
  Assertion.overwriteMethod('most', override('lte', 'at most', utils));
}

function override(method: keyof utils.BigNumber, name: string, utils: Chai.ChaiUtils) {
  return (_super: Function) => overwriteBigNumberFunction(method, name, _super, utils);
}

function overwriteBigNumberFunction(
  functionName: keyof utils.BigNumber,
  readableName: string,
  _super: Function,
  chaiUtils: Chai.ChaiUtils
) {
  return function (this: Chai.AssertionStatic, ...args: any[]) {
    const [actual] = args;
    const expected = chaiUtils.flag(this, 'object');
    if (utils.BigNumber.isBigNumber(expected)) {
      this.assert(
        expected[functionName](actual),
        `Expected "${expected}" to be ${readableName} ${actual}`,
        `Expected "${expected}" NOT to be ${readableName} ${actual}`,
        expected,
        actual
      );
    } else if (utils.BigNumber.isBigNumber(actual)) {
      this.assert(
        actual[functionName](expected),
        `Expected "${expected}" to be ${readableName} ${actual}`,
        `Expected "${expected}" NOT to be ${readableName} ${actual}`,
        expected,
        actual
      );
    } else {
      _super.apply(this, args);
    }
  };
};
