import {expect} from 'chai';
import {GethProvider} from '../src';

describe('GethProvider', () => {
  const provider = new GethProvider();

  it('getBlockNumber', async () => {
    expect(await provider.getBlockNumber()).to.equal(0);
  });
});
