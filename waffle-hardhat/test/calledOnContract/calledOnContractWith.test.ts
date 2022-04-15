import {MockProvider} from 'ethereum-waffle';
import {calledOnContractWithTest} from '@ethereum-waffle/chai/test';
import { proxyProvider } from '../hardhatPatches';

describe('INTEGRATION: calledOnContractWith', () => {
  const provider = proxyProvider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  calledOnContractWithTest(provider);
});
