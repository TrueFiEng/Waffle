import {BytesLike, utils} from 'ethers';
import {Hexable} from 'ethers/lib/utils';
import {convertStructToPlainObject, isStruct} from './misc/struct';

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
          if (isStruct(actualArgs[paramIndex])) {
            new Assertion(
              convertStructToPlainObject(actualArgs[paramIndex])
            ).to.deep.equal(expectedValue);
            return;
          }
          new Assertion(actualArgs[paramIndex],
            `value of "${key}" argument in the "${context.eventName}" event`)
            .equal(expectedValue);
        }
      }
    }
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
