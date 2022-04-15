import {MockProvider} from 'ethereum-waffle';
import {calledOnContractTest} from '@ethereum-waffle/chai/test';
import { proxyProvider } from '../hardhatPatches';

describe('INTEGRATION: calledOnContract', () => {
  const provider = proxyProvider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  calledOnContractTest(provider);
});
