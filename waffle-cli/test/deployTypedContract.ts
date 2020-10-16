import {parseEther} from 'ethers/lib/utils';
import {BasicTokenMock, BasicTokenMockFactory} from '../build';
import {MockProvider} from '../src';
import {deployTypedContract} from '../src/deployTypedContraсt';
import {expect} from 'chai';

describe('INTEGRATION: deployTypedContract', () => {
  const [wallet] = new MockProvider().getWallets();

  it('successfully deploys contract', async () => {
    const contract: BasicTokenMock = await deployTypedContract(wallet,
      BasicTokenMockFactory,
      [wallet.address, parseEther('100')]
    );
    expect(await contract.balanceOf(wallet.address)).to.eq(parseEther('100'));
  });
});
