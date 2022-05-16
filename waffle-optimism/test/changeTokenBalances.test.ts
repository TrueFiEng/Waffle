import {changeTokenBalancesTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from '../src/provider';

describe('Optimism: changeEtherBalance matcher', () => {
  const provider = getOptimismProvider();

  changeTokenBalancesTest(provider);
});
