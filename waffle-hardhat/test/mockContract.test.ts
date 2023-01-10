import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {mockContractDirectTest} from '@ethereum-waffle/mock-contract/test/directTest';
import {mockContractProxiedTest} from '@ethereum-waffle/mock-contract/test/proxiedTest';

describe('INTEGRATION: Mock Contract', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  mockContractDirectTest(provider);
  mockContractProxiedTest(provider);
});
