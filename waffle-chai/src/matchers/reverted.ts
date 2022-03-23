export function supportReverted(Assertion: Chai.AssertionStatic) {
  Assertion.addProperty('reverted', function (this: any) {
    const promise = this._obj;
    const onError = (error: any) => {
      const message = (error instanceof Object && 'message' in error) ? error.message : JSON.stringify(error);
      const isReverted = message.search('revert') >= 0;
      const isThrown = message.search('invalid opcode') >= 0;
      const isError = message.search('code=') >= 0;
      this.assert(
        isReverted || isThrown || isError,
        `Expected transaction to be reverted, but other exception was thrown: ${error}`,
        'Expected transaction NOT to be reverted',
        'Transaction reverted.',
        error
      );
      return error;
    };
    const onSuccess = (value: any) => {
      if ('wait' in value) {
        // Sending the transaction succeeded, but we wait to see if it will revert on-chain.
        return value.wait().then((newValue: any) => newValue, onError);
      }
      this.assert(
        false,
        'Expected transaction to be reverted',
        'Expected transaction NOT to be reverted',
        'Transaction reverted.',
        'Transaction NOT reverted.'
      );
      return value;
    };
    const derivedPromise = promise.then(onSuccess, onError);
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    return this;
  });
}
