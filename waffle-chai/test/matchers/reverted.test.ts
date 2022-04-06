import {describeMockProviderCases} from './MockProviderCases';
import { revertedTest } from './revertedTest';
import { revertedWithTest } from './revertedWithTest';

describeMockProviderCases('INTEGRATION: Matchers: reverted', (provider) => {
  revertedTest(provider);
});

describeMockProviderCases('INTEGRATION: Matchers: revertedWith', (provider) => {
  revertedWithTest(provider);
});
