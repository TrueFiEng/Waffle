import chai from 'chai';
import {createMockProvider, deployContract, getWallets} from '../../lib/waffle';
import BasicToken from './contracts/BasicToken';

const {expect} = chai;

describe('Example', () => {
  let provider;
  let token;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    token = await deployContract(wallet, BasicToken);  
  });
  
  it('Should be able to test', async () => {
    const actualBalance = await token.balanceOf(wallet.address);
    expect(actualBalance.eq(0)).to.be.true;
  });  
});
