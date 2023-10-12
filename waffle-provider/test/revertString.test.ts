import {expect} from 'chai';
import {ZeroAddress} from 'ethers';
import {appendRevertString} from '../src/revertString';
import {deployToken} from './BasicToken';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: MockProvider.callHistory', (provider) => {
  it('decodes revert strings from calls', async () => {
    const [wallet] = await provider.getWallets();

    const token = await deployToken(wallet, 10);

    try {
      await token.transfer(ZeroAddress, 1);
    } catch (transactionError: any) {
      await appendRevertString(provider, transactionError.receipt);
      expect(transactionError.receipt.revertString).to.be.equal('Invalid address');
    }
  });
});
