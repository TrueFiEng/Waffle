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
  
  it('Assigns initial balance', async () => {
    const actualBalance = await token.balanceOf(wallet.address);
    expect(actualBalance.eq(1000)).to.be.true;
  });  

  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo.address, 7);
    const toBalance = await token.balanceOf(walletTo.address);
    expect(toBalance.eq(7)).to.be.true;
  });

  it('Transfer emits event', async () => {
    expect(token.transfer(walletTo.address, 7)).to.emit(token, 'Transfer');
  });

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  });
});
