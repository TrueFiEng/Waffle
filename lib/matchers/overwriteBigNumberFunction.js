import {utils} from 'ethers';

const overwriteBigNumberFunction = (functionName, readableName, _super, chaiUtils) =>
  function (...args) {
    const [actual] = args;
    const expected = chaiUtils.flag(this, 'object');
    if (utils.BigNumber.isBigNumber(expected)) {
      this.assert(expected[functionName](actual),
        `Expected "${expected}" to be ${readableName} ${actual}`,
        `Expected "${expected}" NOT to be ${readableName} ${actual}`,
        expected,
        actual);
    } else if (utils.BigNumber.isBigNumber(actual)) {
      this.assert(actual[functionName](expected),
        `Expected "${expected}" to be ${readableName} ${actual}`,
        `Expected "${expected}" NOT to be ${readableName} ${actual}`,
        expected,
        actual);
    } else {
      _super.apply(this, args);
    }
  };

export default overwriteBigNumberFunction;
