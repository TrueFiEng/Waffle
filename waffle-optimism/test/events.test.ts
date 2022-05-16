import {eventsTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from '../src/provider';

describe('Optimism: changeEtherBalance matcher', () => {
  const provider = getOptimismProvider();

  eventsTest(provider);
});
