import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {mockContractDirectTest} from '@ethereum-waffle/mock-contract/test/directTest';

describe('INTEGRATION: mock contract', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  mockContractDirectTest(provider);
});
