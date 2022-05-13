import {eventsTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('Optimism: changeEtherBalance matcher', () => {
  const provider = getOptimismProvider();

  eventsTest(provider);
});
