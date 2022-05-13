import {chainingMatchersTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('Optimism: chaining', () => {
  const provider = getOptimismProvider();

  chainingMatchersTest(provider);
});
