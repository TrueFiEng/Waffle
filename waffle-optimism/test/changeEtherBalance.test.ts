import {changeEtherBalanceTest} from '@ethereum-waffle/chai/test';
import {calculateL2TxGasFee, getOptimismProvider} from './utils';

describe('Optimism: changeEtherBalance matcher', () => {
  const provider = getOptimismProvider();
  let txGasFees: number;

  // needed to get fees for a single transaction on Optimism - it can be non constant
  before(async () => {
    txGasFees = await calculateL2TxGasFee(provider as any);
  });

  changeEtherBalanceTest(provider, {txGasFees: () => txGasFees, baseFeePerGas: 1});
});
