import {Contract} from 'ethers';
import {MockProvider, RecordedCall} from '@ethereum-waffle/provider';

type IsInCallHistory = (call: RecordedCall) => boolean

export function supportEthCalledWith(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod('ethCalledWith', function (this: any, parameters: Array<any>) {
    const [contract, fnName] = this._obj;

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

    const fnSighash = contract.interface.functions[fnName].encode(parameters);

    const isInCallHistory = (cb: IsInCallHistory): boolean => provider.callHistory.some(cb);

    this.assert(
      isInCallHistory(call => call.data === fnSighash),
      'Expected contract function to be called',
      'Expected contract function NOT to be called',
      undefined
    );
  });
}
