import { providers } from 'ethers';

type TransactionResponse = providers.TransactionResponse;
type MaybePromise<T> = T | Promise<T>;

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
 */
export const transactionPromise = (chaiObj: any) => {
  if ('promise' in chaiObj) {
    return;
  }

  const tx: (() => MaybePromise<TransactionResponse>) | MaybePromise<TransactionResponse> = chaiObj._obj;
  let txResponse: MaybePromise<TransactionResponse>;

  if (typeof tx === 'function') {
    txResponse = tx();
  } else {
    txResponse = tx;
  }

  if (!('then' in txResponse)) {
    chaiObj.response = txResponse;
    chaiObj.promise = txResponse.wait().then(txRecipt => chaiObj.receipt = txRecipt);
  } else {
    chaiObj.promise = new Promise<void>((resolve, reject) => {
      if (!('then' in txResponse)) {
        reject(new Error('txResponse is not a promise'));
        return;
      }
      txResponse.then(txResponse => {
        chaiObj.response = txResponse;
        txResponse.wait().then(txReceipt => {
          chaiObj.receipt = txReceipt;
          resolve();
        }).catch(reject)
      }).catch(reject);
    });
  }

  // Setting `then` and `catch` on the chai object to be compliant with the chai-aspromised library.
  chaiObj.then = chaiObj.promise.then.bind(chaiObj.promise);
  chaiObj.catch = chaiObj.promise.catch.bind(chaiObj.promise);
}
