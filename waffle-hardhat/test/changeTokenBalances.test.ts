import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {changeTokenBalancesTest} from '@ethereum-waffle/chai/test';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  changeTokenBalancesTest(provider);
});
