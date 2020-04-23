import {Contract} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';

export function supportEthCalled(Assertion: Chai.AssertionStatic) {
  Assertion.addProperty('ethCalled', function () {
    const contract = this._obj as Contract;
    const provider = contract.provider as MockProvider;

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
