import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import {calledOnContractTest} from '@ethereum-waffle/chai/test';

describe('INTEGRATION: calledOnContract', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  beforeEach(() => provider.clearCallHistory())

  calledOnContractTest(provider);
});
