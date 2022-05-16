import {chainingMatchersTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from '../src/provider';

describe('Optimism: chaining', () => {
  const provider = getOptimismProvider();

  chainingMatchersTest(provider);
});
