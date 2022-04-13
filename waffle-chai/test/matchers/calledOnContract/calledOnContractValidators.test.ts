import {describeMockProviderCases} from '../MockProviderCases';
import {calledOnContractValidatorsTest} from './calledOnContractValidatorsTest';

describeMockProviderCases('INTEGRATION: ethCalledValidators', (provider) => {
  calledOnContractValidatorsTest(provider);
});
