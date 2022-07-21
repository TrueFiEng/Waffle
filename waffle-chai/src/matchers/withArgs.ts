import {utils} from 'ethers';
import {convertStructToPlainObject, isStruct} from './misc/struct';

/**
 * Used for testing the arguments of events or custom errors.
 * Should be used after .emit or .revertedWith matchers respectively.
 */
export function supportWithArgs(Assertion: Chai.AssertionStatic) {
  const assertArgsArraysEqual = (context: any, expectedArgs: any[], arg: any) => {
    let actualArgs: utils.Result;
    let wrongNumberOfArgsMsg: string;
    if (context.txMatcher === 'emit') {
      actualArgs = (context.contract.interface as utils.Interface).parseLog(arg).args;
      wrongNumberOfArgsMsg = `Expected "${context.eventName}" event to have ${expectedArgs.length} argument(s), ` +
        `but it has ${actualArgs.length}`;
    } else if (context.txMatcher === 'revertedWith') {
      actualArgs = arg;
      wrongNumberOfArgsMsg = `Expected "${context.txErrorName}" event to have ${expectedArgs.length} argument(s), ` +
        `but it has ${actualArgs.length}`;
    } else {
      throw new Error('Unknown txMatcher');
    }
    context.assert(
      actualArgs.length === expectedArgs.length,
      wrongNumberOfArgsMsg,
      'Do not combine .not. with .withArgs()',
      expectedArgs.length,
      actualArgs.length
    );
    for (let index = 0; index < expectedArgs.length; index++) {
      if (expectedArgs[index]?.length !== undefined && typeof expectedArgs[index] !== 'string') {
        context.assert(
          actualArgs[index].length === expectedArgs[index].length,
          `Expected ${actualArgs[index]} to equal ${expectedArgs[index]}, ` +
          'but they have different lengths',
          'Do not combine .not. with .withArgs()'
        );
        for (let j = 0; j < expectedArgs[index].length; j++) {
          new Assertion(actualArgs[index][j]).equal(expectedArgs[index][j]);
        }
      } else {
        if (actualArgs[index].hash !== undefined && actualArgs[index]._isIndexed === true) {
          const expectedArgBytes = utils.isHexString(expectedArgs[index])
            ? utils.arrayify(expectedArgs[index]) : utils.toUtf8Bytes(expectedArgs[index]);
          new Assertion(actualArgs[index].hash).to.be.oneOf(
            [expectedArgs[index], utils.keccak256(expectedArgBytes)]
          );
        } else {
          if (isStruct(actualArgs[index])) {
            new Assertion(
              convertStructToPlainObject(actualArgs[index])
            ).to.deep.equal(expectedArgs[index]);
            return;
          }
          new Assertion(actualArgs[index]).equal(expectedArgs[index]);
        }
      }
    }
  };

  const tryAssertArgsArraysEqual = (context: any, expectedArgs: any[], args: any[]) => {
    if (args.length === 1) return assertArgsArraysEqual(context, expectedArgs, args[0]);
    if (context.txMatcher !== 'emit') {
      throw new Error('Wrong format of arguments');
    }
    for (const index in args) {
      try {
        assertArgsArraysEqual(context, expectedArgs, args[index]);
        return;
      } catch {}
    }
    context.assert(false,
      `Specified args not emitted in any of ${context.args.length} emitted "${context.eventName}" events`,
      'Do not combine .not. with .withArgs()'
    );
  };

  Assertion.addMethod('withArgs', function (this: any, ...expectedArgs: any[]) {
    if (!('txMatcher' in this) || !('callPromise' in this)) {
      throw new Error('withArgs() must be used after emit() or revertedWith()');
    }
    const isNegated = this.__flags.negate === true;
    this.callPromise = this.callPromise.then(() => {
      const isCurrentlyNegated = this.__flags.negate === true;
      this.__flags.negate = isNegated;
      tryAssertArgsArraysEqual(this, expectedArgs, this.args);
      this.__flags.negate = isCurrentlyNegated;
    });
    this.then = this.callPromise.then.bind(this.callPromise);
    this.catch = this.callPromise.catch.bind(this.callPromise);
    return this;
  });
}
