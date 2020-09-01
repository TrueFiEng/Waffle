import {Contract, Transaction, utils} from 'ethers';
import diff from 'jest-diff';

import {filterLogsWithTopics, compareArgs} from './utils';

export async function toHaveEmittedWith(
  transaction: Transaction,
  contract: Contract,
  eventName: string,
  expectedArgs: unknown[]
): Promise<{ pass: boolean; message: () => string }> {
  const receipt = await contract.provider.getTransactionReceipt(
    transaction.hash as string
  );

  let eventFragment: utils.EventFragment | undefined;
  try {
    eventFragment = contract.interface.getEvent(eventName);
  } catch (e) {
    // ignore error
  }

  // check if event is in the contract ABI
  if (eventFragment === undefined) {
    return {
      pass: false,
      message: () =>
        `Expected event "${eventName}" to be emitted, but it doesn't exist in the contract. ` +
        'Please make sure you\'ve compiled its latest version before running the test.'
    };
  }

  const topic = contract.interface.getEventTopic(eventFragment);
  const logs = filterLogsWithTopics(receipt.logs, topic, contract.address);

  if (logs.length === 0) {
    return {
      pass: false,
      message: () =>
        `Expected event "${eventName}" to be emitted, but it wasn't`
    };
  }

  const results = [];
  for (const log of logs) {
    try {
      const actualArgs = contract.interface.parseLog(log).args;
      const pass = compareArgs(actualArgs, expectedArgs);
      results.push({
        pass,
        actualArgs,
        expectedArgs
      });
    } catch {
      results.push({pass: false});
    }
  }

  // return early if there is a match for the event we are looking for
  for (const res of results) {
    if (res.pass === true) {
      return {
        pass: true,
        message: () =>
          `Expected specified args to NOT be emitted in any of ${logs.length} emitted "${eventName}" events`
      };
    }
  }

  // no match found, so we will return the last negative result w/ a rich diff
  const lastResult = results[results.length - 1];
  return {
    pass: false,
    message: () =>
      diff(lastResult.expectedArgs, lastResult.actualArgs) ||
      'The expected args do not match the received args. No diff is available.'
  };
}
