import {decodeRevertString} from '@ethereum-waffle/provider';

export function supportRevertedWith(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('revertedWith', function (this: any, revertReason: string | RegExp) {
    const promise = this._obj;

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
        decodeHardhatError(error) ??
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

    const derivedPromise = promise.then(onSuccess, onError);
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    return this;
  });
}

const decodeHardhatError = (error: any) => {
  const tryDecode = (error: any) => {
    const errorString = String(error);
    {
      const regexp = new RegExp('VM Exception while processing transaction: reverted with reason string \'(.*)\'');
      const matches = regexp.exec(errorString);
      if (matches && matches.length >= 1) {
        return matches[1];
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
