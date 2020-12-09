import {Expectation} from 'earljs/internals';
import {getControl} from '../getControl';

export function toBeAHexString(
  this: Expectation<string>,
  length?: number
): void {
  const ctrl = getControl(this);

  if (length !== undefined) {
    const regexp = new RegExp(`^0x[0-9-a-fA-F]{${length}}$`);
    ctrl.assert({
      success: regexp.test(ctrl.actual),
      reason: `String "${ctrl.actual}" is not a hex string of length ${length}!`,
      negatedReason: `String "${ctrl.actual}" is a hex string of length ${length}!`
    });
  } else {
    const regexp = /^0x[0-9-a-fA-F]*$/;
    ctrl.assert({
      success: regexp.test(ctrl.actual),
      reason: `String "${ctrl.actual}" is not a hex string!`,
      negatedReason: `String "${ctrl.actual}" is a hex string!`
    });
  }
}
