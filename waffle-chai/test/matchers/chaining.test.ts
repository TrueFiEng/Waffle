import {chainingMatchersTest} from './chaining';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: chaining matchers', (provider) => {
  chainingMatchersTest(provider);
});
