import {expect} from 'chai';
import {loadFixture, deployContract} from '../../lib/waffle';
import BasicTokenMock from './build/BasicTokenMock';

describe('INTEGRATION: Fixtures example', () => {
  async function fixture(provider, [wallet, other]) {
    const token = await deployContract(wallet, BasicTokenMock, [
      wallet.address, 1000
    ]);
    return {token, wallet, other};
  }

  it('Assigns initial balance', async () => {
    const {token, wallet} = await loadFixture(fixture);
    expect(await token.balanceOf(wallet.address)).to.eq(1000);
  });

  it('Transfer adds amount to destination account', async () => {
    const {token, other} = await loadFixture(fixture);
    await token.transfer(other.address, 7);
    expect(await token.balanceOf(other.address)).to.eq(7);
  });
});
