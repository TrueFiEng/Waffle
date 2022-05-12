import {changeEtherBalancesTest} from './changeEtherBalancesTest';
import { TX_GAS, BASE_FEE_PER_GAS } from './constants';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: changeEtherBalances matcher', (provider) => {
  changeEtherBalancesTest(provider, { txGasFees: TX_GAS * BASE_FEE_PER_GAS, baseFeePerGas: BASE_FEE_PER_GAS  });
});
