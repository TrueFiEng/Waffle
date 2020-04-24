import {Contract} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';

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

    if (typeof fnName !== 'string') {
      throw new TypeError('ethCalled: function name must be a string');
    }
    if (!(fnName in contract.interface.functions)) {
      throw new TypeError('ethCalled: function must exist in provided contract');
    }

    const funCallData = contract.interface.functions[fnName].encode(parameters);

    this.assert(
      provider.callHistory.some(call => {
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
