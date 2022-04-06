import {describeMockProviderCases} from './MockProviderCases';
import {changeTokenBalanceTest} from './changeTokenBalanceTest';

describeMockProviderCases('INTEGRATION: changeTokenBalance matcher', (provider) => {
  changeTokenBalanceTest(provider);
});
