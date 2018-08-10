import chai from 'chai';
import {createMockProvider, deployContract, getWallets} from '../../lib/waffle';
import BasicTokenMock from './build/BasicTokenMock';
import solidity from '../../lib/matchers';

chai.use(solidity);

const {expect} = chai;

describe('Example', () => {
  let provider;
  let token;
  let wallet;
  let walletTo;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, walletTo] = await getWallets(provider);
    token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);  
  });
  
  it('assigns initial balance', async () => {
    const actualBalance = await token.balanceOf(wallet.address);
    expect(actualBalance.eq(1000)).to.be.true;
  });  

  it('transfer', async () => {
    await token.transfer(walletTo.address, 7);
    const toBalance = await token.balanceOf(walletTo.address);
    expect(toBalance.eq(7)).to.be.true;
  });

  it('can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  });
});
