import {chainingMatchersTest} from './chaining';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: changeEtherBalances matcher', (provider) => {
  chainingMatchersTest(provider);
});
