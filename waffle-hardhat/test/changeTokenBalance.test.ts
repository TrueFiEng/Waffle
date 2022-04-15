import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {changeTokenBalanceTest} from '@ethereum-waffle/chai/test';
import './hardhatPatches'

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  changeTokenBalanceTest(provider);
});
