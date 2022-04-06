import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {changeEtherBalanceTest} from '@ethereum-waffle/chai/test';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  changeEtherBalanceTest(provider);
});
