import {Contract, providers, utils} from 'ethers';
import {keccak256, toUtf8Bytes} from 'ethers/lib/utils';
import {callPromise} from '../call-promise';
import {waitForPendingTransaction} from './misc/transaction';
import {supportWithArgs} from './withArgs';
import {supportWithNamedArgs} from './withNamedArgs';

export function supportEmit(Assertion: Chai.AssertionStatic) {
  const filterLogsWithTopics = (logs: providers.Log[], topic: any, contractAddress?: string) =>
    logs.filter((log) => log.topics.includes(topic))
      .filter((log) =>
        log.address &&
        (contractAddress === undefined || log.address.toLowerCase() === contractAddress.toLowerCase()
        ));

  const assertEmit = (assertion: any, frag: utils.EventFragment, from?: string) => {
    const topic = keccak256(toUtf8Bytes(frag.format()));
    const isNegated = assertion.__flags.negate === true;
    assertion.callPromise = assertion.callPromise.then(() => {
      if (!('txReceipt' in assertion)) {
        throw new Error('The emit matcher must be called on a transaction');
      }
      const receipt: providers.TransactionReceipt = assertion.txReceipt;
      assertion.args = filterLogsWithTopics(receipt.logs, topic, from);
      const isCurrentlyNegated = assertion.__flags.negate === true;
      assertion.__flags.negate = isNegated;
      assertion.assert(assertion.args.length > 0,
        `Expected event "${frag.name}" to be emitted, but it wasn't`,
        `Expected event "${frag.name}" NOT to be emitted, but it was`
      );
      assertion.__flags.negate = isCurrentlyNegated;
    });
  };

  Assertion.addMethod('emit', function (this: any, contractOrEventSig: Contract|string, eventName?: string) {
    if (typeof this._obj === 'string') {
      if (typeof contractOrEventSig === 'string') {
        throw new Error('The emit by event signature matcher must be called on a transaction');
      }
      // Handle specific case of using transaction hash to specify transaction. Done for backwards compatibility.
      this.callPromise = waitForPendingTransaction(this._obj, contractOrEventSig.provider)
        .then(txReceipt => {
          this.txReceipt = txReceipt;
        });
    } else {
      callPromise(this);
    }

    if (typeof contractOrEventSig === 'string') {
      let eventFragment: utils.EventFragment | undefined;
      try {
        eventFragment = utils.EventFragment.from(contractOrEventSig);
      } catch (e) {
        throw new Error(`Invalid event signature: "${contractOrEventSig}"`);
      }
      assertEmit(this, eventFragment);
    } else if (typeof contractOrEventSig === 'object' && eventName) {
      let eventFragment: utils.EventFragment | undefined;
      try {
        eventFragment = contractOrEventSig.interface.getEvent(eventName);
      } catch (e) {
        // ignore error
      }
      if (eventFragment === undefined) {
        this.assert(
          this.__flags.negate,
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
      assertEmit(this, eventFragment, contractOrEventSig.address);

      this.contract = contractOrEventSig;
    } else {
      throw new Error('The emit matcher must be called with a contract and an event name or an event signature');
    }

    this.then = this.callPromise.then.bind(this.callPromise);
    this.catch = this.callPromise.catch.bind(this.callPromise);
    this.eventName = eventName;
    this.txMatcher = 'emit';
    return this;
  });

  supportWithArgs(Assertion);
  supportWithNamedArgs(Assertion);
}
