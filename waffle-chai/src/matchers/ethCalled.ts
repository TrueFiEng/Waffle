import {Contract} from 'ethers';
import {MockProvider, RecordedCall} from '@ethereum-waffle/provider';

interface AssertionResultInterface {
  wasCalled: boolean;
  errorMessage: string;
  negatedErrorMessage: string;
}

type IsInCallHistory = (call: RecordedCall) => boolean

export function supportEthCalled(Assertion: Chai.AssertionStatic) {
  Assertion.addProperty('ethCalled', function () {
    const arg = this._obj;
    const [contract, fnName] = Array.isArray(arg) ? arg : [arg];

    if (!(contract instanceof Contract)) {
      throw new TypeError('ethCalled: argument must be a contract');
    }
    const provider = contract.provider;
    if (!(provider instanceof MockProvider)) {
      throw new TypeError('ethCalled: contract.provider must be a MockProvider');
    }
    if (fnName !== undefined && typeof fnName !== 'string') {
      throw new TypeError('ethCalled: function name must be a string');
    }

    const fnSighash = fnName && contract.interface.functions[fnName].sighash;

    const isInCallHistory = (cb: IsInCallHistory): boolean => provider.callHistory.some(cb);

    const getAssertionResult = (): AssertionResultInterface => {
      if (fnSighash) {
        return {
          wasCalled: isInCallHistory(call => call.data === fnSighash),
          errorMessage: 'Expected contract function to be called',
          negatedErrorMessage: 'Expected contract function NOT to be called'
        };
      }
      return {
        wasCalled: isInCallHistory(call => call.address === contract.address),
        errorMessage: 'Expected contract to be called',
        negatedErrorMessage: 'Expected contract NOT to be called'
      };
    };

    const {wasCalled, errorMessage, negatedErrorMessage} = getAssertionResult();

    this.assert(
      wasCalled,
      errorMessage,
      negatedErrorMessage,
      undefined
    );
  });
}
