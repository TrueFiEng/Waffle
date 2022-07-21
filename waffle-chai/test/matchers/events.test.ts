import {describeMockProviderCases} from './MockProviderCases';
import {eventsTest, eventsWithNamedArgs} from './eventsTest';

describeMockProviderCases('INTEGRATION: Events', (provider) => {
  eventsTest(provider);
  eventsWithNamedArgs(provider);
});
