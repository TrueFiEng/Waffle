import chai from 'chai';
import {createMockProvider, withMockENS} from '../../lib/waffle';

const {expect} = chai;

describe('MockENS', () => {
  it('warning message', async () => {
    const provider = await withMockENS(createMockProvider());
    await provider.ens.setAddr('coolDomain.eth', '0x2cd2ff232df61Cb6CE14DC3643dbc642b758E7f3');
    const address = await provider.resolveName('cooldomain.eth');
    expect(address).to.eq('0x2cd2ff232df61Cb6CE14DC3643dbc642b758E7f3');
  });
});
