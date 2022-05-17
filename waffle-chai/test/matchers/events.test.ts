import {describeMockProviderCases} from './MockProviderCases';
import {eventsTest} from './eventsTest';

describeMockProviderCases('INTEGRATION: Events', (provider) => {
  eventsTest(provider);
});
