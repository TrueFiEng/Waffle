export function supportReverted(Assertion: Chai.AssertionStatic) {
  Assertion.addProperty('reverted', function (this: any) {
    const promise = this._obj;
    const derivedPromise = promise.then(
      (value: any) => {
        this.assert(
          false,
          'Expected transaction to be reverted',
          'Expected transaction NOT to be reverted',
          'Transaction reverted.',
          'Transaction NOT reverted.'
        );
        return value;
      },
      (reason: any) => {
        reason = (reason instanceof Object && 'message' in reason) ? reason.message : reason;
        const isReverted = reason.toString().search('revert') >= 0;
        const isThrown = reason.toString().search('invalid opcode') >= 0;
        this.assert(
          isReverted || isThrown,
          `Expected transaction to be reverted, but other exception was thrown: ${reason}`,
          'Expected transaction NOT to be reverted',
          'Transaction reverted.',
          reason
        );
        return reason;
      }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    return this;
  });
}
