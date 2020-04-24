import {Contract} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';

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
    if (fnName !== undefined) {
      if (typeof fnName !== 'string') {
        throw new TypeError('ethCalled: function name must be a string');
      }
      if (!(fnName in contract.interface.functions)) {
        throw new TypeError('ethCalled: function must exist in provided contract');
      }
    }

    const fnSighash = fnName && contract.interface.functions[fnName].sighash;
    const callHistory = provider.callHistory;

    if (fnSighash) {
      this.assert(
        callHistory.some(call => {
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
        callHistory.some(call => call.address === contract.address),
        'Expected contract to be called',
        'Expected contract NOT to be called',
        undefined
      );
    }
  });
}
