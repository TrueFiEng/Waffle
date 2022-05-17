import {chainingMatchersTest} from '@ethereum-waffle/chai/test';
import {OptimismProvider} from '../src/provider';

describe('Optimism: chaining', () => {
  const provider = new OptimismProvider();

  chainingMatchersTest(provider);
});
