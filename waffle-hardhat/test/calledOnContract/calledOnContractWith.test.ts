import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {calledOnContractWithTest} from '@ethereum-waffle/chai/test';

describe('INTEGRATION: calledOnContractWith', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  beforeEach(() => provider.clearCallHistory());

  calledOnContractWithTest(provider);
});
