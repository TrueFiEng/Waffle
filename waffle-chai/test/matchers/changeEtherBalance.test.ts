import {changeEtherBalanceTest} from './changeEtherBalanceTest';
import { BASE_FEE_PER_GAS, TX_GAS } from './constants';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: changeEtherBalance matcher', (provider) => {
  changeEtherBalanceTest(provider, { txGasFees: TX_GAS * BASE_FEE_PER_GAS, baseFeePerGas: BASE_FEE_PER_GAS });
});
