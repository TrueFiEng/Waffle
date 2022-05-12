import {chainingMatchersTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('INTEGRATION: chaining', () => {
  const provider = getOptimismProvider();

  chainingMatchersTest(provider);
});
