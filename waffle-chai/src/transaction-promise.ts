import {providers} from 'ethers';

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
  if ('txPromise' in chaiObj) {
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
    chaiObj.txResponse = txResponse;
    chaiObj.txPromise = txResponse.wait().then(txReceipt => {
      chaiObj.txReceipt = txReceipt;
    });
  } else {
    chaiObj.txPromise = txResponse.then(async txResponse => {
      chaiObj.txResponse = txResponse;
      if (typeof txResponse.wait === 'function') {
        const txReceipt = await txResponse.wait();
        chaiObj.txReceipt = txReceipt;
      }
    });
  }

  // Setting `then` and `catch` on the chai object to be compliant with the chai-aspromised library.
  chaiObj.then = chaiObj.txPromise.then.bind(chaiObj.txPromise);
  chaiObj.catch = chaiObj.txPromise.catch.bind(chaiObj.txPromise);
};
