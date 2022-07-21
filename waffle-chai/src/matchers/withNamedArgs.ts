import {BytesLike, utils} from 'ethers';
import {Hexable} from 'ethers/lib/utils';

/**
 * Used for testing the arguments of events or custom errors, naming the arguments.
 * Can test the subset of all arguments.
 * Should be used after .emit matcher.
 */
export function supportWithNamedArgs(Assertion: Chai.AssertionStatic) {
  const assertArgsObjectEqual = (context: any, expectedArgs: Record<string, unknown>, arg: any) => {
    const logDescription = (context.contract.interface as utils.Interface).parseLog(arg);
    const actualArgs = logDescription.args;

    for (const [key, expectedValue] of Object.entries(expectedArgs)) {
      const paramIndex = logDescription.eventFragment.inputs.findIndex(input => input.name === key);
      new Assertion(paramIndex, `"${key}" argument in the "${context.eventName}" event not found`).gte(0);
      if (Array.isArray(expectedValue)) {
        for (let j = 0; j < expectedValue.length; j++) {
          new Assertion(
            actualArgs[paramIndex][j],
            `"${key}" value at index "${j}" on "${context.eventName}" event`)
            .equal(expectedValue[j]);
        }
      } else {
        if (actualArgs[paramIndex].hash !== undefined && actualArgs[paramIndex]._isIndexed) {
          const expectedArgBytes = utils.isHexString(expectedValue)
            ? utils.arrayify(expectedValue as BytesLike | Hexable | number)
            : utils.toUtf8Bytes(expectedValue as string);
          new Assertion(
            actualArgs[paramIndex].hash,
            `value of indexed "${key}" argument in the "${context.eventName}" event ` +
            `to be hash of or equal to "${expectedValue}"`
          ).to.be.oneOf([expectedValue, utils.keccak256(expectedArgBytes)]);
        } else {
          new Assertion(actualArgs[paramIndex],
            `value of "${key}" argument in the "${context.eventName}" event`)
            .equal(expectedValue);
        }
      }
    }

    // for (let index = 0; index < expectedArgs.length; index++) {
    //   if (expectedArgs[index]?.length !== undefined && typeof expectedArgs[index] !== 'string') {
    //     context.assert(
    //       actualArgs[index].length === expectedArgs[index].length,
    //       `Expected ${actualArgs[index]} to equal ${expectedArgs[index]}, ` +
    //       'but they have different lengths',
    //       'Do not combine .not. with .withArgs()'
    //     );
    //     for (let j = 0; j < expectedArgs[index].length; j++) {
    //       new Assertion(actualArgs[index][j]).equal(expectedArgs[index][j]);
    //     }
    //   } else {
    //     if (actualArgs[index].hash !== undefined && actualArgs[index]._isIndexed === true) {
    //       const expectedArgBytes = utils.isHexString(expectedArgs[index])
    //         ? utils.arrayify(expectedArgs[index]) : utils.toUtf8Bytes(expectedArgs[index]);
    //       new Assertion(actualArgs[index].hash).to.be.oneOf(
    //         [expectedArgs[index], utils.keccak256(expectedArgBytes)]
    //       );
    //     } else {
    //       if (isStruct(actualArgs[index])) {
    //         new Assertion(
    //           convertStructToPlainObject(actualArgs[index])
    //         ).to.deep.equal(expectedArgs[index]);
    //         return;
    //       }
    //       new Assertion(actualArgs[index]).equal(expectedArgs[index]);
    //     }
    //   }
    // }
  };

  const tryAssertArgsObjectEqual = (context: any, expectedArgs: Record<string, unknown>, args: any[]) => {
    if (args.length === 1) return assertArgsObjectEqual(context, expectedArgs, args[0]);
    if (context.txMatcher !== 'emit') {
      throw new Error('Wrong format of arguments');
    }
    for (const index in args) {
      try {
        assertArgsObjectEqual(context, expectedArgs, args[index]);
        return;
      } catch {}
    }
    context.assert(false,
      `Specified args not emitted in any of ${context.args.length} emitted "${context.eventName}" events`,
      'Do not combine .not. with .withArgs()'
    );
  };

  const isStruct = (arr: any[]) => {
    if (!Array.isArray(arr)) return false;
    const keys = Object.keys(arr);
    const hasAlphaNumericKeys = keys.some((key) => key.match(/^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/));
    const hasNumericKeys = keys.some((key) => key.match(/^\d+$/));
    return hasAlphaNumericKeys && hasNumericKeys;
  };

  const convertStructToPlainObject = (struct: any[]): any => {
    const keys = Object.keys(struct).filter((key: any) => isNaN(key));
    return keys.reduce(
      (acc: any, key: any) => ({
        ...acc,
        [key]: isStruct(struct[key])
          ? convertStructToPlainObject(struct[key])
          : struct[key]
      }),
      {}
    );
  };

  Assertion.addMethod('withNamedArgs', function (this: any, expectedArgs: Record<string, unknown>) {
    if (!('txMatcher' in this) || !('callPromise' in this)) {
      throw new Error('withNamedArgs() must be used after emit()');
    }
    const isNegated = this.__flags.negate === true;
    this.callPromise = this.callPromise.then(() => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      tryAssertArgsObjectEqual(this, expectedArgs, this.args);
      this.__flags.negate = isCurrentlyNegated;
    });
    this.then = this.callPromise.then.bind(this.callPromise);
    this.catch = this.callPromise.catch.bind(this.callPromise);
    return this;
  });
}
