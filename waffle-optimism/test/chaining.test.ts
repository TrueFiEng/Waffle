import {chainingMatchersTest} from '@ethereum-waffle/chai/test';
import { getOptimismProvider } from '../src';

describe('INTEGRATION: chaining', () => {
  const provider = getOptimismProvider();

  chainingMatchersTest(provider);
});
