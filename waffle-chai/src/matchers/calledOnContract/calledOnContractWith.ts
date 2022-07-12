import {validateContract, validateFnName, validateMockProvider} from './calledOnContractValidators';
import {assertCalledWithParams} from './assertions';

export function supportCalledOnContractWith(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('calledOnContractWith', function (this: any, contract: any, parameters: any[]) {
    const fnName = this._obj;
    const negated = this.__flags.negate;

    validateContract(contract);
    validateMockProvider(contract.provider);
    validateFnName(fnName, contract);

    assertCalledWithParams(this, contract, fnName, parameters, negated);
  });
}
