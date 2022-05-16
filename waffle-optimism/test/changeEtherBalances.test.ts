import {changeEtherBalancesTest} from '@ethereum-waffle/chai/test';
import {calculateL2TxGasFee, getOptimismProvider} from './utils';

describe('Optimism: changeEtherBalances matcher', () => {
  const provider = getOptimismProvider();
  let txGasFees: number;

  before(async () => {
    txGasFees = await calculateL2TxGasFee(provider as any);
  });

  changeEtherBalancesTest(provider, {txGasFees: () => txGasFees, baseFeePerGas: 1});
});
