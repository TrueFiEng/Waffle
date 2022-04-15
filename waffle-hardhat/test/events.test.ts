import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {eventsTest} from '@ethereum-waffle/chai/test';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  eventsTest(provider);
});
