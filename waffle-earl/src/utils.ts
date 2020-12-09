import {utils} from 'ethers';
import {Expectation, Control} from 'earljs/internals';

export function getControl<T>(expectation: Expectation<T>): Control<T> {
  return expectation['getControl']();
}

const HEX_REGEX = /^0x[0-9-a-fA-F]*$/;

export function isAddress(value: string) {
  return HEX_REGEX.test(value) && utils.isAddress(value);
}

export function isHexString(value: string, length?: number) {
  const isHex = HEX_REGEX.test(value);
  const correctLength = length === undefined || value.length === length + 2;
  return isHex && correctLength;
}
