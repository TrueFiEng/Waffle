import {eventsTest} from '@ethereum-waffle/chai/test';
import { getOptimismProvider } from '../src';

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = getOptimismProvider();

  eventsTest(provider);
});
