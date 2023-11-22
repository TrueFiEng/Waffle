import {Result, Interface, getBytes, keccak256, isHexString, toUtf8Bytes} from 'ethers';
import {convertStructToPlainObject, isStruct} from './misc/struct';
import {ensure} from "./calledOnContract/utils";

/**
 * Used for testing the arguments of events or custom errors.
 * Should be used after .emit or .revertedWith matchers respectively.
 */
export function supportWithArgs(Assertion: Chai.AssertionStatic) {
  const assertArgsArraysEqual = (context: any, expectedArgs: any[], arg: any) => {
    let actualArgs: Result;
    let wrongNumberOfArgsMsg: string;
    if (context.txMatcher === 'emit') {
      const log = (context.contract.interface as Interface).parseLog(arg)
      ensure(log !== null, Error,'Could not parse log');
      actualArgs = log.args;
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
        if (actualArgs[index].hash !== undefined && actualArgs[index]._isIndexed) {
          const expectedArgBytes = isHexString(expectedArgs[index])
            ? getBytes(expectedArgs[index]) : toUtf8Bytes(expectedArgs[index]);
          new Assertion(actualArgs[index].hash).to.be.oneOf(
            [expectedArgs[index], keccak256(expectedArgBytes)]
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
