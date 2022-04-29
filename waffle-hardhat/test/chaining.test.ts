import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {chainingMatchersTest} from '@ethereum-waffle/chai/test';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  chainingMatchersTest(provider);
});
