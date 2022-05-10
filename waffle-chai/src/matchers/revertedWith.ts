import {decodeRevertString} from '@ethereum-waffle/provider';
import {transactionPromise} from '../transaction-promise';

export function supportRevertedWith(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('revertedWith', function (this: any, revertReason: string | RegExp) {
    transactionPromise(this);

    const assertNotReverted = () => this.assert(
      false,
      'Expected transaction to be reverted',
      'Expected transaction NOT to be reverted',
      'Transaction reverted.',
      'Transaction NOT reverted.'
    );

    const onSuccess = (value: any) => {
      if (value && 'wait' in value) {
        // Sending the transaction succeeded, but we wait to see if it will revert on-chain.
        return value.wait().then((newValue: any) => {
          assertNotReverted();
          return newValue;
        }, onError);
      }
      assertNotReverted();
      return value;
    };

    const onError = (error: any) => {
      const revertString = error?.receipt?.revertString ??
        decodeHardhatError(error, this) ??
        decodeRevertString(error);

      if (revertString !== undefined) {
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
      }

      // See https://github.com/ethers-io/ethers.js/issues/829
      const isEstimateGasError =
        error instanceof Object &&
        error.code === 'UNPREDICTABLE_GAS_LIMIT' &&
        'error' in error;

      if (isEstimateGasError) {
        error = error.error;
      }

      const reasonsList = error.results && Object.values(error.results).map((o: any) => o.reason);
      const message = (error instanceof Object && 'message' in error) ? error.message : JSON.stringify(error);
      const isReverted = reasonsList
        ? reasonsList.some((r: string) => revertReason instanceof RegExp ? revertReason.test(r) : r === revertReason)
        : message.includes('revert') &&
          (revertReason instanceof RegExp ? revertReason.test(message) : message.includes(revertReason));
      const isThrown = message.search('invalid opcode') >= 0 && revertReason === '';

      this.assert(
        isReverted || isThrown,
        `Expected transaction to be reverted with "${revertReason}", but other exception was thrown: ${error}`,
        `Expected transaction NOT to be reverted with "${revertReason}"`,
        `Transaction reverted with "${revertReason}".`,
        error
      );
      return error;
    };

    this.txPromise = this.txPromise.then(onSuccess, onError);
    this.then = this.txPromise.then.bind(this.txPromise);
    this.catch = this.txPromise.catch.bind(this.txPromise);
    this.txMatcher = 'revertedWith';
    return this;
  });
}

const decodeHardhatError = (error: any, context: any) => {
  const tryDecode = (error: any) => {
    const errorString = String(error);
    {
      const regexp = /VM Exception while processing transaction: reverted with custom error '([a-zA-Z0-9]+)\((.*)\)'/g;
      const matches = regexp.exec(errorString);
      if (matches && matches.length >= 1) {
        // needs to be wrapped in list to be consistent with the emit matcher
        context.args = [JSON.parse(`[${matches[2]}]`)];
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
    return undefined;
  };

  return tryDecode(error) ?? tryDecode(error.error); // the error may be wrapped
};
