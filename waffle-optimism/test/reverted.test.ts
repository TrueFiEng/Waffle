import {revertedTest, revertedWithTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('INTEGRATION: Matchers: reverted', () => {
  const provider = getOptimismProvider();

  revertedTest(provider);
});

describe('INTEGRATION: Matchers: revertedWith', () => {
  const provider = getOptimismProvider();

  revertedWithTest(provider, {includePanicCodes: false});
});
