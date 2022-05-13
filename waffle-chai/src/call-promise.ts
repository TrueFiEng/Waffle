import {providers} from 'ethers';

type TransactionResponse = providers.TransactionResponse;
type MaybePromise<T> = T | Promise<T>;

const isTransactionResponse = (response: any): response is TransactionResponse => {
  return 'wait' in response;
};

/**
 * Takes a chai object (usually a `this` object) and adds a `promise` property to it.
 * Adds a `response` property to the chai object with the transaction response.
 * The promised is resolved when the transaction is mined.
 * Adds a `receipt` property to the chai object with the transaction receipt when the promise is resolved.
 * May be called on a chai object which contains any of these:
 * - a transaction response
 * - a promise which resolves to a transaction response
 * - a function that returns a transaction response
 * - a function that returns a promise which resolves to a transaction response
 * - same combinations as above but query instead of transaction.
 *  Attention: some matchers require to be called on a transaction.
 */
export const callPromise = (chaiObj: any) => {
  if ('callPromise' in chaiObj) {
    return;
  }

  const call = chaiObj._obj;
  let response: MaybePromise<any>;

  if (typeof call === 'function') {
    response = call();
  } else {
    response = call;
  }

  if (!('then' in response)) {
    if (isTransactionResponse(response)) {
      chaiObj.txResponse = response;
      chaiObj.callPromise = response.wait().then(txReceipt => {
        chaiObj.txReceipt = txReceipt;
      });
    } else {
      chaiObj.queryResponse = response;
      chaiObj.callPromise = Promise.resolve();
    }
  } else {
    chaiObj.callPromise = response.then(async (response: any) => {
      if (isTransactionResponse(response)) {
        chaiObj.txResponse = response;
        const txReceipt = await response.wait();
        chaiObj.txReceipt = txReceipt;
      } else {
        chaiObj.queryResponse = response;
      }
    });
  }

  // Setting `then` and `catch` on the chai object to be compliant with the chai-aspromised library.
  chaiObj.then = chaiObj.callPromise.then.bind(chaiObj.callPromise);
  chaiObj.catch = chaiObj.callPromise.catch.bind(chaiObj.callPromise);
};
