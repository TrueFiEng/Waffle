import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {changeEtherBalanceTest} from '@ethereum-waffle/chai/test';
import {TX_GAS, BASE_FEE_PER_GAS} from './constants';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  changeEtherBalanceTest(provider, {txGasFees: TX_GAS * BASE_FEE_PER_GAS, baseFeePerGas: BASE_FEE_PER_GAS});
});
