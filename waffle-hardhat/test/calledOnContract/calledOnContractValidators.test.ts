import {MockProvider} from 'ethereum-waffle';
import {calledOnContractValidatorsTest} from '@ethereum-waffle/chai/test';
import { proxyProvider } from '../hardhatPatches';

describe('INTEGRATION: ethCalledValidators', () => {
  const provider = proxyProvider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  calledOnContractValidatorsTest(provider);
});
