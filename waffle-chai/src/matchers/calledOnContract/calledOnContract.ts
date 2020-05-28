import {validateContract, validateFnName, validateMockProvider} from './calledOnContractValidators';

export function supportCalledOnContract(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('calledOnContract', function (contract: any) {
    const fnName = this._obj;

    validateContract(contract);
    validateMockProvider(contract.provider);
    if (fnName !== undefined) {
      validateFnName(fnName, contract);
    }

    const fnSighash = contract.interface.getSighash(fnName);

    this.assert(
      contract.provider.callHistory.some(
        call => call.address === contract.address && call.data.startsWith(fnSighash)
      ),
      'Expected contract function to be called',
      'Expected contract function NOT to be called',
      undefined
    );
  });
}
