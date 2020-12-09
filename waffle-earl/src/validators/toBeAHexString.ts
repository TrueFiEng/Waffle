import {Expectation} from 'earljs/internals';
import {getControl, isHexString} from '../utils';

export function toBeAHexString(
  this: Expectation<string>,
  length?: number
): void {
  const ctrl = getControl(this);

  if (length !== undefined) {
    ctrl.assert({
      success: isHexString(ctrl.actual, length),
      reason: `String "${ctrl.actual}" is not a hex string of length ${length}!`,
      negatedReason: `String "${ctrl.actual}" is a hex string of length ${length}!`
    });
  } else {
    ctrl.assert({
      success: isHexString(ctrl.actual),
      reason: `String "${ctrl.actual}" is not a hex string!`,
      negatedReason: `String "${ctrl.actual}" is a hex string!`
    });
  }
}
