import {changeEtherBalanceTest} from './changeEtherBalanceTest';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: changeEtherBalance matcher', (provider) => {
  changeEtherBalanceTest(provider);
});
