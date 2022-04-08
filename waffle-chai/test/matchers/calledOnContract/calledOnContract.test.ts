import {describeMockProviderCases} from '../MockProviderCases';
import {calledOnContractTest} from './calledOnContractTest';

describeMockProviderCases('INTEGRATION: calledOnContract', (provider) => {
  calledOnContractTest(provider);
});
