import {decodeRevertString} from '@ethereum-waffle/provider';
import {ethers} from 'ethers';
import {callPromise} from '../call-promise';
import JSONbig from 'json-bigint';

export function supportRevertedWith(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('revertedWith', function (this: any, revertReason: string | RegExp) {
    callPromise(this);
    const assertNotReverted = () => this.assert(
      false,
      'Expected transaction to be reverted',
      'Expected transaction NOT to be reverted',
      'Transaction reverted.',
      'Transaction NOT reverted.'
    );

    const onError = (error: any) => {
      const revertString = error?.receipt?.revertString ??
        decodeHardhatError(error, this) ??
        decodeOptimismError(error) ??
        decodeRevertString(error);

      const isReverted = revertReason instanceof RegExp
        ? revertReason.test(revertString)
        : revertString === revertReason;
      this.assert(
        isReverted,
        `Expected transaction to be reverted with "${revertReason}", but other reason was found: "${revertString}"`,
        `Expected transaction NOT to be reverted with "${revertReason}"`,
        `Transaction reverted with "${revertReason}"`,
        error
      );

      return error;
    };

    this.callPromise = this.callPromise.then(assertNotReverted, onError);
    this.then = this.callPromise.then.bind(this.callPromise);
    this.catch = this.callPromise.catch.bind(this.callPromise);
    this.txMatcher = 'revertedWith';
    return this;
  });
}

const errorInterface = new ethers.utils.Interface(['function Error(string)']);
const decodeHardhatError = (error: any, context: any) => {
  const tryDecode = (error: any) => {
    if (error === undefined) {
      return undefined;
    }
    if (
      error?.errorName &&
      /**
       * Preserve old behaviour for non-custom errors,
       * because if the case of regular errors,
       * with revertedWith we match against the argument of error (single string),
       * not against the error name like in the case of custom errors - because it is always just Error.
       * We don't want to require the user to do `expect(tx).to.be.revertedWith('Error').withArgs('Require cause')`.
       */
      error?.errorName !== 'Error' &&
      error.errorArgs
    ) {
      context.args = [error.errorArgs];
      context.txErrorName = error.errorName;
      return error.errorName;
    }
    if (error?.data) {
      try {
        const decodedReason = errorInterface.decodeFunctionData('Error', error.data);
        if (decodedReason[0]) return decodedReason[0];
      } catch {}
    }

    const errorString = String(error);
    {
      // eslint-disable-next-line max-len
      const regexp = /VM Exception while processing transaction: reverted with custom error '([a-zA-Z0-9$_]+)\((.*)\)'/g;
      const matches = regexp.exec(errorString);
      if (matches && matches.length >= 1) {
        // Matches is in a format of string: "arg1, arg2, arg3, ..."
        // So it only makes sense in an array:
        const matchesList = `[${matches[2]}]`;
        // Next, it needs to be wrapped in a list to be consistent with the emit matcher:
        context.args = [
          // Additionally, we preserve numbers as strings,
          // otherwise we face an overflow of bignumber.
          JSONbig({storeAsString: true}).parse(matchesList)
        ];
        const errorName = matches[1];
        context.txErrorName = errorName;
        return errorName;
      }
    }
    {
      const regexp = new RegExp('VM Exception while processing transaction: reverted with panic code ([a-zA-Z0-9]*)');
      const matches = regexp.exec(errorString);
      if (matches && matches.length >= 1) {
        return 'panic code ' + matches[1];
      }
    }
    {
      const regexp = new RegExp('Error: Transaction reverted: (.*)');
      const matches = regexp.exec(errorString);
      if (matches && matches.length >= 1) {
        return matches[1];
      }
    }
    {
      const regexp = /revert(ed)? with reason (string )?("(?:[^\\"]|\\.)*")/;
      const matches = regexp.exec(errorString);
      if (matches && matches.length >= 1) {
        return JSON.parse(matches[matches.length - 1]); // parse escapes
      }
    }
    {
      const regexp = new RegExp('revert(ed)? with reason (string )?\'(.*)\'');
      const matches = regexp.exec(errorString);
      if (matches && matches.length >= 1) {
        return matches[matches.length - 1];
      }
    }
    return undefined;
  };

  return tryDecode(error.error?.error) ??
    tryDecode(error.error) ??
    tryDecode(error); // the error may be wrapped
};

const decodeOptimismError = (error: any) => {
  const tryDecode = (error: any) => {
    const body = error?.body;
    if (body) {
      const errorString = JSON.parse(body)?.error?.message;
      const regexp = /execution reverted: (.*)/g;
      const matches = regexp.exec(errorString);
      if (matches && matches.length >= 1) {
        return matches[1];
      }
    }
  };

  return tryDecode(error) ??
    tryDecode(error?.error) ??
    tryDecode(error?.error?.error);
};
