import {validateExpectArguments, validateFnName} from './calledOnContractValidators';
import {RecordedCall} from '@ethereum-waffle/provider';

export function supportCalledOnContractWith(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('calledOnContractWith', function (this: any, contract: any, parameters: Array<any>) {
    const fnName = this._obj;

    validateExpectArguments(contract);
    validateFnName(fnName, contract);

    const funCallData = contract.interface.functions[fnName].encode(parameters);

    this.assert(
      contract.provider.callHistory.some((call: RecordedCall) => {
        return (
          call.address === contract.address &&
          call.data === funCallData
        );
      }),
      'Expected contract function with parameters to be called',
      'Expected contract function with parameters NOT to be called',
      undefined
    );
  });
}
