import {arrayIntersection} from './utils';

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

  const filterLogsWithTopics = (logs, topics) =>
    logs.filter((log) => arrayIntersection(topics, log.topics).length > 0);

  Assertion.addMethod('emit', function (contract, eventName) {
    /* eslint-disable no-underscore-dangle */
    const promise = this._obj;
    const derivedPromise = promise.then((tx) => 
      contract.provider.getTransactionReceipt(tx.hash)
    ).then((receipt) => {
      const filtered = filterLogsWithTopics(receipt.logs, contract.interface.events[eventName].topics);
      if (filtered.length < 1) {
        return Promise.reject(`Expected event to be thrown, but no`);
      }
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    return derivedPromise;
  });
};

export default solidity;
