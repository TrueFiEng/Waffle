import {callPromise} from '../call-promise';

export function supportReverted(Assertion: Chai.AssertionStatic) {
  Assertion.addProperty('reverted', function (this: any) {
    callPromise(this);
    const onError = (error: any) => {
      const message = (error instanceof Object && 'message' in error) ? error.message : JSON.stringify(error);
      const isReverted = message.search('revert') >= 0;
      const isThrown = message.search('invalid opcode') >= 0;
      const isError = message.search('code=') >= 0;
      this.assert(
        isReverted || isThrown || isError,
        `Expected transaction to be reverted, but other exception was thrown: ${error}`,
        `Expected transaction NOT to be reverted, but it was reverted with "${message}"`,
        'Transaction reverted.',
        error
      );
      return error;
    };

    const assertNotReverted = () => this.assert(
      false,
      'Expected transaction to be reverted',
      'Expected transaction NOT to be reverted',
      'Transaction reverted.',
      'Transaction NOT reverted.'
    );

    this.callPromise = this.callPromise.then(assertNotReverted, onError);
    this.then = this.callPromise.then.bind(this.callPromise);
    this.catch = this.callPromise.catch.bind(this.callPromise);
    return this;
  });
}
