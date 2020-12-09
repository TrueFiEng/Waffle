import {Expectation, Control} from 'earljs/internals';

export function getControl<T>(expectation: Expectation<T>): Control<T> {
  return expectation['getControl']();
}
