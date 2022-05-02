import {Contract, providers, utils} from 'ethers';
import {transactionPromise} from '../transaction-promise';
import {waitForPendingTransaction} from './misc/transaction';

export function supportEmit(Assertion: Chai.AssertionStatic) {
  const filterLogsWithTopics = (logs: providers.Log[], topic: any, contractAddress: string) =>
    logs.filter((log) => log.topics.includes(topic))
      .filter((log) => log.address && log.address.toLowerCase() === contractAddress.toLowerCase());

  Assertion.addMethod('emit', function (this: any, contract: Contract, eventName: string) {
    if (typeof this._obj === 'string') {
      // Handle specific case of using transaction hash to specify transaction. Done for backwards compatibility.
      this.txPromise = waitForPendingTransaction(this._obj, contract.provider)
        .then(txReceipt => {
          this.txReceipt = txReceipt;
        });
    } else {
      transactionPromise(this);
    }
    const isNegated = this.__flags.negate === true;
    this.txPromise = this.txPromise
      .then(() => {
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
        this.logs = filterLogsWithTopics(receipt.logs, topic, contract.address);
        // As this callback will be resolved after the chain of matchers is finished, we need to
        // know if the matcher has been negated or not. To simulate chai behaviour, we keep track of whether
        // the matcher has been negated or not and set the internal chai flag __flags.negate to the same value.
        // After the assertion is finished, we set the flag back to original value to not affect other assertions.
        const isCurrentlyNegated = this.__flags.negate === true;
        this.__flags.negate = isNegated;
        this.assert(this.logs.length > 0,
          `Expected event "${eventName}" to be emitted, but it wasn't`,
          `Expected event "${eventName}" NOT to be emitted, but it was`
        );
        this.__flags.negate = isCurrentlyNegated;
      });
    this.then = this.txPromise.then.bind(this.txPromise);
    this.catch = this.txPromise.catch.bind(this.txPromise);
    this.contract = contract;
    this.eventName = eventName;
    return this;
  });

  const assertArgsArraysEqual = (context: any, expectedArgs: any[], log: any) => {
    const actualArgs = (context.contract.interface as utils.Interface).parseLog(log).args;
    context.assert(
      actualArgs.length === expectedArgs.length,
      `Expected "${context.eventName}" event to have ${expectedArgs.length} argument(s), ` +
      `but it has ${actualArgs.length}`,
      'Do not combine .not. with .withArgs()',
      expectedArgs.length,
      actualArgs.length
    );
    for (let index = 0; index < expectedArgs.length; index++) {
      if (expectedArgs[index]?.length !== undefined && typeof expectedArgs[index] !== 'string') {
        for (let j = 0; j < expectedArgs[index].length; j++) {
          new Assertion(actualArgs[index][j]).equal(expectedArgs[index][j]);
        }
      } else {
        if (actualArgs[index].hash !== undefined && actualArgs[index]._isIndexed === true) {
          const expectedArgBytes = utils.isHexString(expectedArgs[index])
            ? utils.arrayify(expectedArgs[index]) : utils.toUtf8Bytes(expectedArgs[index]);
          new Assertion(actualArgs[index].hash).to.be.oneOf(
            [expectedArgs[index], utils.keccak256(expectedArgBytes)]
          );
        } else {
          new Assertion(actualArgs[index]).equal(expectedArgs[index]);
        }
      }
    }
  };

  const tryAssertArgsArraysEqual = (context: any, expectedArgs: any[], logs: any[]) => {
    if (logs.length === 1) return assertArgsArraysEqual(context, expectedArgs, logs[0]);
    for (const index in logs) {
      try {
        assertArgsArraysEqual(context, expectedArgs, logs[index]);
        return;
      } catch {}
    }
    context.assert(false,
      `Specified args not emitted in any of ${context.logs.length} emitted "${context.eventName}" events`,
      'Do not combine .not. with .withArgs()'
    );
  };

  Assertion.addMethod('withArgs', function (this: any, ...expectedArgs: any[]) {
    if (!('txPromise' in this)) {
      throw new Error('withArgs() must be used after emit()');
    }
    this.txPromise = this.txPromise.then(() => {
      tryAssertArgsArraysEqual(this, expectedArgs, this.logs);
    });
    this.then = this.txPromise.then.bind(this.txPromise);
    this.catch = this.txPromise.catch.bind(this.txPromise);
    return this;
  });
}
