import {changeEtherBalanceTest} from './changeEtherBalanceTest';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: changeEtherBalance matcher2', (provider) => {
  changeEtherBalanceTest(provider);
});
