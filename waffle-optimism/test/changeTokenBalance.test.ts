import {changeTokenBalanceTest} from '@ethereum-waffle/chai/test';
import {OptimismProvider} from '../src/provider';

describe('Optimism: changeTokenBalance matcher', () => {
  const provider = new OptimismProvider();

  changeTokenBalanceTest(provider);
});
