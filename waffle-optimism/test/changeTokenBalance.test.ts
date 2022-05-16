import {changeTokenBalanceTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from '../src/provider';

describe('Optimism: changeTokenBalance matcher', () => {
  const provider = getOptimismProvider();

  changeTokenBalanceTest(provider);
});
