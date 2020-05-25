import chai, {expect} from 'chai';
import {utils} from 'ethers';
import {ENS, deployENS} from '@ethereum-waffle/ens';
import {MockProvider} from '@ethereum-waffle/provider';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const {namehash} = utils;

describe('Deploy Ens', async () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  let ens: ENS;

  beforeEach(async () => {
    ens = await deployENS(wallet);
    await ens.createTopLevelDomain('test');
  });

  describe('Create domain', async () => {
    it('sub domain', async () => {
      const node = namehash('ethworks.test');
      await ens.createSubDomain('ethworks.test');
      expect(await ens.ens.owner(node)).to.eq(ens.registrars['ethworks.test'].address);
      expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
    });

    it('sub domain recursive', async () => {
      const node = namehash('ethworks.tld');
      await ens.createSubDomain('ethworks.tld', {recursive: true});
      expect(await ens.ens.owner(node)).to.eq(ens.registrars['ethworks.tld'].address);
      expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
    });
  });

  describe('Set address', async () => {
    it('Recursive', async () => {
      const node = namehash('vlad.test.tld');
      await ens.setAddress('vlad.test.tld', ens.wallet.address, {recursive: true});
      expect(await ens.ens.owner(node)).to.eq(ens.wallet.address);
      expect(await ens.resolver['addr(bytes32)'](node)).to.eq(ens.wallet.address);
      expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
    });
    it('Reverse', async () => {
      await ens.setAddressWithReverse('vlad.ethworks.test', wallet, {recursive: true});
      const node = namehash(wallet.address.slice(2) + '.addr.reverse');
      expect(await ens.ens.owner(node)).to.eq(ens.reverseRegistrar.address);
      expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
      expect(await ens.resolver.name(node)).to.eq('vlad.ethworks.test');
    });
  });
});
