import {changeEtherBalancesTest} from './changeEtherBalancesTest';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: changeEtherBalances matcher', (provider) => {
  changeEtherBalancesTest(provider);
});
