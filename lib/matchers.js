
const solidity = (chai) => {
  const {Assertion} = chai;  
  Assertion.addProperty('reverted', function () {
    /* eslint-disable no-underscore-dangle */
    const promise = this._obj;
    const derivedPromise = promise.then(
      (value) => {
        this.assert(false, 
          'Expected transaction to be reverted',
          'Expected transaction NOT to be reverted',
          'not reverted',
          'reverted');  
        return value;        
      },
      (reason) => {
        this.assert(reason.toString().search('revert') >= 0, 
          `Expected transaction to be reverted, but other exception was thrown: ${reason}`,
          'Expected transaction NOT to be reverted',
          'Reverted',
          reason);    
        return reason;
      }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    return derivedPromise;
  });
};

export default solidity;
