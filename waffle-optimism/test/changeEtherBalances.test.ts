import {changeEtherBalancesTest} from '@ethereum-waffle/chai/test';
import {OptimismProvider} from '../src/provider';
import {calculateL2TxGasFee} from './utils';

describe('Optimism: changeEtherBalances matcher', () => {
  const provider = new OptimismProvider();
  let txGasFees: number;

  before(async () => {
    txGasFees = await calculateL2TxGasFee(provider as any);
  });

  changeEtherBalancesTest(provider, {txGasFees: () => txGasFees, baseFeePerGas: 1});
});
