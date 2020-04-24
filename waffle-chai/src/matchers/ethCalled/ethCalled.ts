import {validateExpectArguments, validateFnName} from './ethCalledValidators';
import {RecordedCall} from '@ethereum-waffle/provider';

export function supportEthCalled(Assertion: Chai.AssertionStatic) {
  Assertion.addProperty('ethCalled', function () {
    const arg = this._obj;
    const [contract, fnName] = Array.isArray(arg) ? arg : [arg];

    validateExpectArguments(contract);
    if (fnName !== undefined) {
      validateFnName(fnName, contract);
    }

    const fnSighash = fnName && contract.interface.functions[fnName].sighash;
    const callHistory = contract.provider.callHistory;

    if (fnSighash) {
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
    } else {
      this.assert(
        callHistory.some((call: RecordedCall) => call.address === contract.address),
        'Expected contract to be called',
        'Expected contract NOT to be called',
        undefined
      );
    }
  });
}
