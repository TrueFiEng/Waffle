import {describeMockProviderCases} from './MockProviderCases';
import {changeTokenBalancesTest} from './changeTokenBalancesTest';

describeMockProviderCases('INTEGRATION: changeTokenBalances matcher', (provider) => {
  changeTokenBalancesTest(provider);
});
