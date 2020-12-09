import {Expectation} from 'earljs/internals';
import {getControl, isAddress} from '../utils';

export function toBeAnAddress(this: Expectation<string>): void {
  const ctrl = getControl(this);

  ctrl.assert({
    success: isAddress(ctrl.actual),
    reason: `String "${ctrl.actual}" is not an ethereum address!`,
    negatedReason: `String "${ctrl.actual}" is an ethereum address!`
  });
}
