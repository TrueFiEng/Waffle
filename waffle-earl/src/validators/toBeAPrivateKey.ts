import {Expectation} from 'earljs/internals';
import {getControl, isPrivateKey} from '../utils';

export function toBeAPrivateKey(this: Expectation<string>): void {
  const ctrl = getControl(this);

  ctrl.assert({
    success: isPrivateKey(ctrl.actual),
    reason: `String "${ctrl.actual}" is not a private key!`,
    negatedReason: `String "${ctrl.actual}" is a private key!`
  });
}
