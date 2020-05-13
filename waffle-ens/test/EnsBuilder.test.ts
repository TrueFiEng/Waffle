import chai, {expect} from 'chai';
import {constants, utils} from 'ethers';
import {MockProvider} from '@ethereum-waffle/provider';
import {createENSBuilder, ENSBuilder} from '../src/index';

import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const {AddressZero} = constants;
const {namehash} = utils;
const noExistingNode = '0x0000000000000000000000000000000000000000000000000000000000000001';

describe('INTEGRATION: Deploy Ens', async () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  let ensBuilder: ENSBuilder;

  before(async () => {
    ensBuilder = await createENSBuilder(wallet);
  });

  it('ENS deployed', async () => {
    expect(await ensBuilder.ens.owner(noExistingNode)).to.equal(AddressZero);
  });

  it('PublicResolver deployed and setup', async () => {
    expect(await ensBuilder.ens.resolver(namehash('resolver'))).to.eq(ensBuilder.resolver.address);
    expect(await ensBuilder.ens.owner(namehash('resolver'))).to.eq(wallet.address);
    expect(await ensBuilder.resolver['addr(bytes32)'](namehash('resolver'))).to.eq(ensBuilder.resolver.address);
  });

  it('ReverseRegistrar deployed and setup', async () => {
    expect(await ensBuilder.ens.owner(namehash('reverse'))).to.eq(wallet.address);
    expect(await ensBuilder.ens.owner(namehash('addr.reverse'))).to.eq(ensBuilder.reverseRegistrar.address);
  });

  describe('Create domain', async () => {
    describe('Non recursive', async () => {
      it('top level domain', async () => {
        await ensBuilder.createTopLevelDomain('test');
        expect(await ensBuilder.ens.owner(namehash('test'))).to.eq(ensBuilder.registrars['test'].address);
      });

      it('sub domain', async () => {
        await ensBuilder.createSubDomain('ethworks.test');
        expect(await ensBuilder.ens.owner(namehash('ethworks.test')))
          .to.eq(ensBuilder.registrars['ethworks.test'].address);
        expect(await ensBuilder.ens.resolver(namehash('ethworks.test'))).to.eq(ensBuilder.resolver.address);
      });

      it('third level domain', async () => {
        await ensBuilder.createSubDomain('dev.ethworks.test');
        expect(await ensBuilder.ens.owner(namehash('dev.ethworks.test')))
          .to.eq(ensBuilder.registrars['dev.ethworks.test'].address);
        expect(await ensBuilder.ens.resolver(namehash('dev.ethworks.test'))).to.eq(ensBuilder.resolver.address);
      });
    });

    describe('Recursive', async () => {
      it('third level domain', async () => {
        await ensBuilder.createSubDomain('waffle.projects.test', {recursive: true});
        expect(await ensBuilder.ens.owner(namehash('waffle.projects.test')))
          .to.eq(ensBuilder.registrars['waffle.projects.test'].address);
        expect(await ensBuilder.ens.resolver(namehash('waffle.projects.test'))).to.eq(ensBuilder.resolver.address);
      });
    });

    describe('Fail', async () => {
      it('third level domain for nonexistent second level domain', async () => {
        await expect(ensBuilder.createSubDomain('ens.waffle.test'))
          .to.be.rejectedWith('Domain waffle.test doesn\'t exist.');
      });
    });
  });

  describe('Set address', async () => {
    describe('Non recursive', async () => {
      it('existing domain', async () => {
        const node = namehash('vlad.dev.ethworks.test');
        await ensBuilder.setAddress('vlad.dev.ethworks.test', ensBuilder.wallet.address);
        expect(await ensBuilder.ens.owner(node)).to.eq(ensBuilder.wallet.address);
        expect(await ensBuilder.resolver['addr(bytes32)'](node)).to.eq(ensBuilder.wallet.address);
        expect(await ensBuilder.ens.resolver(node)).to.eq(ensBuilder.resolver.address);
      });
    });

    describe('Reverse', async () => {
      it('reverse registrar', async () => {
        await ensBuilder.setReverseAddress(wallet.address);
        const node = namehash(wallet.address.slice(2) + '.addr.reverse');
        expect(await ensBuilder.ens.owner(node)).to.eq(ensBuilder.reverseRegistrar.address);
        expect(await ensBuilder.ens.resolver(node)).to.eq(ensBuilder.resolver.address);
      });
    });

    describe('Recursive', async () => {
      it('nonexistent domain', async () => {
        const node = namehash('vlad.test.test');
        await ensBuilder.setAddress('vlad.test.test', ensBuilder.wallet.address, {recursive: true});
        expect(await ensBuilder.ens.owner(node)).to.eq(ensBuilder.wallet.address);
        expect(await ensBuilder.resolver['addr(bytes32)'](node)).to.eq(ensBuilder.wallet.address);
        expect(await ensBuilder.ens.resolver(node)).to.eq(ensBuilder.resolver.address);
      });
    });

    describe('Fail', async () => {
      it('nonexistent domain', async () => {
        await expect(ensBuilder.setAddress('vlad.nonexistent.test', ensBuilder.wallet.address))
          .to.be.rejectedWith('Domain nonexistent.test doesn\'t exist.');
      });
    });
  });
});
