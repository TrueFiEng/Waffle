import {describeMockProviderCases} from '../MockProviderCases';
import {calledOnContractWithTest} from './calledOnContractWithTest';

describeMockProviderCases('INTEGRATION: calledOnContractWith', (provider) => {
  calledOnContractWithTest(provider);
});
