import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
// import {calledOnContractValidatorsTest} from '@ethereum-waffle/chai/test';

describe('INTEGRATION: ethCalledValidators', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  // calledOnContractValidatorsTest(provider);
});
