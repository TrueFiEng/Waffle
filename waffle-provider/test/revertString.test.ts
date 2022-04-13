import {expect} from 'chai';
import {constants} from 'ethers';
import {appendRevertString} from '../src/revertString';
import {deployToken} from './BasicToken';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: MockProvider.callHistory', (provider) => {
  it('decodes revert strings from calls', async () => {
    const [wallet] = provider.getWallets();

    const token = await deployToken(wallet, 10);

    try {
      await token.transfer(constants.AddressZero, 1);
    } catch (transactionError: any) {
      await appendRevertString(provider, transactionError.receipt);
      expect(transactionError.receipt.revertString).to.be.equal('Invalid address');
    }
  });
});
