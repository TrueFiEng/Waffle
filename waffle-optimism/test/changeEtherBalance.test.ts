import {changeEtherBalanceTest} from '@ethereum-waffle/chai/test';
import {OptimismProvider} from '../src/provider';
import {calculateL2TxGasFee} from './utils';

describe('Optimism: changeEtherBalance matcher', () => {
  const provider = new OptimismProvider();
  let txGasFees: number;

  // needed to get fees for a single transaction on Optimism - it can be non constant
  before(async () => {
    txGasFees = await calculateL2TxGasFee(provider as any);
  });

  changeEtherBalanceTest(provider, {txGasFees: () => txGasFees, baseFeePerGas: 1});
});
