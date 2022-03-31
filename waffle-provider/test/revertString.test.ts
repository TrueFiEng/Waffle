import {expect} from 'chai';
import {constants} from 'ethers';
import {MockProvider} from '../src/MockProvider';
import {decodeRevertString} from '../src/revertString';
import {deployToken} from './BasicToken';
import { describeMockProviderCases } from './MockProviderCases.test';

describeMockProviderCases('INTEGRATION: MockProvider.callHistory', (provider) => {
  it('decodes revert strings from calls', async () => {
    const [wallet] = provider.getWallets();

    const token = await deployToken(wallet, 10);

    try {
      await token.transfer(constants.AddressZero, 1);
    } catch (transactionError: any) {
      const receipt = transactionError.receipt;
      const revertedTx = await provider.getTransaction(receipt.transactionHash);
      try {
        await provider.call(revertedTx as any, revertedTx.blockNumber);
      } catch (callError: any) {
        const revertString = decodeRevertString(callError);
        expect(revertString).to.be.equal('Invalid address');
      }
    }
  });
});
