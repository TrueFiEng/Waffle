import chai from 'chai';
import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import chaiAsPromised from 'chai-as-promised';
import {changeEtherBalanceTest} from '@ethereum-waffle/chai/test';

chai.use(chaiAsPromised);

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = waffle.provider as MockProvider;

  before(async () => {
    await provider.send('hardhat_reset', []);
  });

  changeEtherBalanceTest(provider);
});
