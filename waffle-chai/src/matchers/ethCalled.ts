import {Contract} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';

export function supportEthCalled(Assertion: Chai.AssertionStatic) {
  Assertion.addProperty('ethCalled', function () {
    const contract = this._obj;
    if (!(contract instanceof Contract)) {
      throw new TypeError('ethCalled: argument must be a contract');
    }
    const provider = contract.provider;
    if (!(provider instanceof MockProvider)) {
      throw new TypeError('ethCalled: contract.provider must be a MockProvider');
    }

    const callHistory = provider.callHistory;

    const wasCalled = callHistory
      .some(el => el.address === contract.address);

    this.assert(
      wasCalled,
      'Expected contract to be called',
      'Expected contract NOT to be called',
      undefined
    );
  });
}
