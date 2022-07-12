import {validateContract, validateFnName, validateMockProvider} from './calledOnContractValidators';
import {assertFunctionCalled} from './assertions';

export function supportCalledOnContract(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('calledOnContract', function (contract: any) {
    const fnName = this._obj;

    validateContract(contract);
    validateMockProvider(contract.provider);
    if (fnName !== undefined) {
      validateFnName(fnName, contract);
    }

    assertFunctionCalled(this, contract, fnName);
  });
}
