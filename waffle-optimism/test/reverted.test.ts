import {revertedTest, revertedWithTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from '../src/provider';

describe('Optimism: Matchers: reverted', () => {
  const provider = getOptimismProvider();

  revertedTest(provider);
});

describe('Optimism: Matchers: revertedWith', () => {
  const provider = getOptimismProvider();

  revertedWithTest(provider, {includePanicCodes: false});
});
