import {revertedTest, revertedWithTest} from '@ethereum-waffle/chai/test';
import {OptimismProvider} from '../src/provider';

describe('Optimism: Matchers: reverted', () => {
  const provider = new OptimismProvider();

  revertedTest(provider);
});

describe('Optimism: Matchers: revertedWith', () => {
  const provider = new OptimismProvider();

  revertedWithTest(provider, {includePanicCodes: false});
});
