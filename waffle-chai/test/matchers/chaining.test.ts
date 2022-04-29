import {chainingMatchersTest} from './chainingTest';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: chaining matchers', (provider) => {
  chainingMatchersTest(provider);
});
