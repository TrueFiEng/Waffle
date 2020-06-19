import {
  Contract,
  Transaction,
  utils,
  providers,
  BigNumber,
  BigNumberish
} from 'ethers';

export async function toEmitWithArgs(
  promise: Promise<Transaction>,
  contract: Contract,
  eventName: string,
  expectedArgs: any[]
) {
  const tx = await promise;
  const receipt = await contract.provider.getTransactionReceipt(
    tx.hash as string
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

  for (const log of logs) {
    try {
      const actualArgs = contract.interface.parseLog(log).args;
      if (actualArgs.length !== expectedArgs.length) {
        return {
          pass: false,
          message: () =>
            `Expected "${eventName}" event to have ${expectedArgs.length} argument(s), ` +
            `but has ${actualArgs.length}`
        };
      }

      const result = assertValues(actualArgs as ArgType[], expectedArgs);
      if (result) return result;
    } catch {}
  }

  return {
    pass: true,
    message: () =>
      `Expected specified args to NOT be emitted in any of ${logs.length} emitted "${eventName}" events`
  };
}

function filterLogsWithTopics(
  logs: providers.Log[],
  topic: any,
  contractAddress: string
) {
  return logs
    .filter((log) => log.topics.includes(topic))
    .filter(
      (log) =>
        log.address &&
        log.address.toLowerCase() === contractAddress.toLowerCase()
    );
}

type ArgType = number | string | BigNumber | ArgType[];

function assertValues(actualArgs: ArgType[], expectedArgs: ArgType[]): any {
  const format = (x: any) => (typeof x === 'string' ? `'${x}'` : x.toString());

  for (let i = 0; i < expectedArgs.length; i++) {
    const actual = actualArgs[i];
    const expected = expectedArgs[i];

    if (Array.isArray(actual) && Array.isArray(expected)) {
      const result: any = assertValues(actual, expected);
      if (result) return result;
    }
    // if one of them is a BigNumber, we need to convert first
    if (BigNumber.isBigNumber(expected) || BigNumber.isBigNumber(expected)) {
      if (!BigNumber.from(expected).eq(actual as BigNumberish)) {
        return {
          pass: false,
          message: () =>
            `Expected ${format(expected)} to equal ${format(actual)}`
        };
      }
    }
    // if neither is a BigNumber, we can just compare their strings
    if (expected.toString() !== actual.toString()) {
      return {
        pass: false,
        message: () =>
          `Expected ${format(expected)} to equal ${format(actual)}`
      };
    }
  }
  return undefined;
}
