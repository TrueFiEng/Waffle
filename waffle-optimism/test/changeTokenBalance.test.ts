import {changeTokenBalanceTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('Optimism: changeTokenBalance matcher', () => {
  const provider = getOptimismProvider();

  changeTokenBalanceTest(provider);
});
