import {validateExpectArguments, validateFnName} from './calledOnContractValidators';
import {RecordedCall} from '@ethereum-waffle/provider';

export function supportCalledOnContract(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('calledOnContract', function (this: any, contract: any) {
    const fnName = this._obj;

    validateExpectArguments(contract);
    if (fnName !== undefined) {
      validateFnName(fnName, contract);
    }

    const fnSighash = contract.interface.functions[fnName].sighash;
    const callHistory = contract.provider.callHistory;

    this.assert(
      callHistory.some((call: RecordedCall) => {
        return (
          call.address === contract.address &&
            call.data.startsWith(fnSighash)
        );
      }),
      'Expected contract function to be called',
      'Expected contract function NOT to be called',
      undefined
    );
  });
}
