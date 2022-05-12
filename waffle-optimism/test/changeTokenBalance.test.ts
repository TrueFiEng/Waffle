import {changeTokenBalanceTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = getOptimismProvider();

  changeTokenBalanceTest(provider);
});
