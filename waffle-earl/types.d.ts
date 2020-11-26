/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExpectInterface,
  Expectation,
  expect,
  loadMatchers,
  mockFn
} from 'earljs';

declare module 'earljs' {
  interface ExpectInterface {
    evenNumber: () => number;
  }

  interface Expectation<T> {
    toBeEven: (this: Expectation<number>) => void;
  }

  export {ExpectInterface, Expectation, expect, loadMatchers, mockFn};
}
