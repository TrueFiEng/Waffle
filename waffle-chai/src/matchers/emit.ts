import {Contract, providers, utils} from 'ethers';
import {callPromise} from '../call-promise';
import {waitForPendingTransaction} from './misc/transaction';
import {supportWithArgs} from './withArgs';
import {supportWithNamedArgs} from './withNamedArgs';

export function supportEmit(Assertion: Chai.AssertionStatic) {
  const filterLogsWithTopics = (logs: providers.Log[], topic: any, contractAddress: string) =>
    logs.filter((log) => log.topics.includes(topic))
      .filter((log) => log.address && log.address.toLowerCase() === contractAddress.toLowerCase());

  Assertion.addMethod('emit', function (this: any, contract: Contract, eventName: string) {
    if (typeof this._obj === 'string') {
      // Handle specific case of using transaction hash to specify transaction. Done for backwards compatibility.
      this.callPromise = waitForPendingTransaction(this._obj, contract.provider)
        .then(txReceipt => {
          this.txReceipt = txReceipt;
        });
    } else {
      callPromise(this);
    }
    const isNegated = this.__flags.negate === true;
    this.callPromise = this.callPromise
      .then(() => {
        if (!('txReceipt' in this)) {
          throw new Error('The emit matcher must be called on a transaction');
        }
        const receipt: providers.TransactionReceipt = this.txReceipt;
        let eventFragment: utils.EventFragment | undefined;
        try {
          eventFragment = contract.interface.getEvent(eventName);
        } catch (e) {
        // ignore error
        }
        if (eventFragment === undefined) {
          this.assert(
            isNegated,
            `Expected event "${eventName}" to be emitted, but it doesn't` +
          ' exist in the contract. Please make sure you\'ve compiled' +
          ' its latest version before running the test.',
            `WARNING: Expected event "${eventName}" NOT to be emitted.` +
          ' The event wasn\'t emitted because it doesn\'t' +
          ' exist in the contract. Please make sure you\'ve compiled' +
          ' its latest version before running the test.',
            eventName,
            ''
          );
          return;
        }

        const topic = contract.interface.getEventTopic(eventFragment);
        this.args = filterLogsWithTopics(receipt.logs, topic, contract.address);
        // As this callback will be resolved after the chain of matchers is finished, we need to
        // know if the matcher has been negated or not. To simulate chai behaviour, we keep track of whether
        // the matcher has been negated or not and set the internal chai flag __flags.negate to the same value.
        // After the assertion is finished, we set the flag back to original value to not affect other assertions.
        const isCurrentlyNegated = this.__flags.negate === true;
        this.__flags.negate = isNegated;
        this.assert(this.args.length > 0,
          `Expected event "${eventName}" to be emitted, but it wasn't`,
          `Expected event "${eventName}" NOT to be emitted, but it was`
        );
        this.__flags.negate = isCurrentlyNegated;
      });
    this.then = this.callPromise.then.bind(this.callPromise);
    this.catch = this.callPromise.catch.bind(this.callPromise);
    this.contract = contract;
    this.eventName = eventName;
    this.txMatcher = 'emit';
    return this;
  });

  supportWithArgs(Assertion);
  supportWithNamedArgs(Assertion);
}
