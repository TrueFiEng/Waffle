import {utils} from 'ethers';

const overwriteBigNumberFunction = (
  functionName: string,
  readableName: string,
  _super: (...args: any[]) => any,
  chaiUtils: {flag: (...args: any[]) => any}
) => function (...args: any[]) {
  const [actual] = args;
  const expected = chaiUtils.flag(this, 'object');
  if (utils.BigNumber.isBigNumber(expected)) {
    this.assert((expected as any)[functionName](actual),
      `Expected "${expected}" to be ${readableName} ${actual}`,
      `Expected "${expected}" NOT to be ${readableName} ${actual}`,
      expected,
      actual);
  } else if (utils.BigNumber.isBigNumber(actual)) {
    this.assert((actual as any)[functionName](expected),
      `Expected "${expected}" to be ${readableName} ${actual}`,
      `Expected "${expected}" NOT to be ${readableName} ${actual}`,
      expected,
      actual);
  } else {
    _super.apply(this, args);
  }
};

export default overwriteBigNumberFunction;
