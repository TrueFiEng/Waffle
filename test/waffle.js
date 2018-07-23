import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {compile, createWeb3} from '../lib/Waffle'

chai.use(chaiAsPromised);

const {expect} = chai;

describe('Waffle', () => {
  let web3;

  beforeEach(async () => {
    ({web3} = await createWeb3());
  });

  it('compile', async () => {
    compile();
  });

  it('createWeb3', async () => {
    expect(web3.utils.randomHex(0)).to.eq('0x');
  });

});