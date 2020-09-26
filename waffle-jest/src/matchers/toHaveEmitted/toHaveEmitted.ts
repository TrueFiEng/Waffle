import {Contract, Transaction, utils} from 'ethers';
import {filterLogsWithTopics} from './utils';

export async function toHaveEmitted(
  transaction: Transaction,
  contract: Contract,
  eventName: string
) {
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
  const pass = logs.length > 0;

  if (pass) {
    return {
      pass: true,
      message: () =>
        `Expected event "${eventName}" NOT to be emitted, but it was`
    };
  } else {
    return {
      pass: false,
      message: () =>
        `Expected event "${eventName}" to be emitted, but it wasn't`
    };
  }
}
