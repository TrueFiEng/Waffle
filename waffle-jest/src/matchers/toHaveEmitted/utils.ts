import {BigNumber, providers} from 'ethers';

export function filterLogsWithTopics(
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

export function compareArgs(actual: any, expected: any): boolean {
  // if one is an array but the other is not, then fail
  if (
    (Array.isArray(actual) && !Array.isArray(expected)) ||
    (!Array.isArray(actual) && Array.isArray(expected))
  ) {
    return false;
  }

  // if they are both arrays recurse
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      return false;
    }

    for (let i = 0; i < actual.length; i++) {
      const result = compareArgs(actual[i], expected[i]);
      if (result === false) return false;
    }
    return true;
  }

  // if one of them is a string, then do a string compare
  const isString = (x: any) => typeof x === 'string';
  if (isString(actual) || isString(expected)) {
    return actual.toString() === expected.toString();
  }

  // compare BigNumbers
  if (actual instanceof BigNumber && expected instanceof BigNumber) {
    return actual.eq(expected);
  }

  // otherwise direct compare
  return actual === expected;
}
