import {toUtf8String} from 'ethers/lib/utils';

/* eslint-disable no-control-regex */

/**
 * Decodes a revert string from a failed call/query that reverts on chain.
 * @param callRevertError The error catched from performing a reverting call (query)
 */
export const decodeRevertString = (callRevertError: any): string => {
  /**
   * https://ethereum.stackexchange.com/a/66173
   * Numeric.toHexString(Hash.sha3("Error(string)".getBytes())).substring(0, 10)
   */
  const errorMethodId = '0x08c379a0';

  if (!callRevertError.data?.startsWith(errorMethodId)) return '';
  return toUtf8String('0x' + callRevertError.data.substring(138))
    .replace(/\x00/g, ''); // Trim null characters.
};
