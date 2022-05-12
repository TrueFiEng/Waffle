import {changeEtherBalancesTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = getOptimismProvider();

  changeEtherBalancesTest(provider, {txGasFees: 27525, baseFeePerGas: 1});
});
