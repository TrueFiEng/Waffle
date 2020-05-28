import chai, {expect} from 'chai';
import {utils} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const {namehash} = utils;

describe('Deploy Ens', async () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();

  before(async () => {
    await provider.setupENS();
  });

  it('Create domain recursive', async () => {
    const node = namehash('ethworks.tld');
    await provider.ens.createSubDomain('ethworks.tld', {recursive: true});
    expect(await provider.ens.ens.owner(node)).to.eq(provider.ens.registrars['ethworks.tld'].address);
    expect(await provider.ens.ens.resolver(node)).to.eq(provider.ens.resolver.address);
  });

  it('Set address', async () => {
    await provider.ens.setAddress('vlad.ethworks.tld', wallet.address);
    expect(await provider.resolveName('vlad.ethworks.tld')).to.eq(wallet.address);
  });

  it('Set address with reverse ', async () => {
    await provider.ens.setAddressWithReverse('vlad.ethworks.test', wallet, {recursive: true});
    expect(await provider.lookupAddress(wallet.address)).to.eq('vlad.ethworks.test');
  });
});
