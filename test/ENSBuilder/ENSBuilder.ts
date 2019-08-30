import {expect} from 'chai';
import {Wallet, providers} from 'ethers';
import Ganache, {GanacheOpts} from 'ganache-core';
import ENSBuilder from '../../lib/ENSBuilder/ENSBuilder';
import {withENS, getWallets, createMockProvider, defaultGanacheOptions} from './utils';
import {Provider} from 'ethers/providers';

describe('ENS Builder', async () => {
  let builder: ENSBuilder;
  let userWallet: Wallet;
  let deployWallet: Wallet;
  let provider: Provider;
  let providerWithEns: Provider;

  describe('Web3', async () => {
    before(async () => {
      const web3Provider = Ganache.provider(defaultGanacheOptions as GanacheOpts);
      provider = new providers.Web3Provider(web3Provider);
      userWallet = new Wallet('0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797', provider);
      deployWallet = new Wallet('0x5c8b9227cd5065c7e3f6b73826b8b42e198c4497f6688e3085d5ab3a6d520e74', provider);
      builder = new ENSBuilder(deployWallet);
    });

    describe('bootstrapWith', () => {
      before(async () => {
        const ensAddress = await builder.bootstrapWith('mylogin', 'eth');
        providerWithEns = withENS(provider, ensAddress);
        await builder.registerAddressWithReverse('alex', 'mylogin.eth', userWallet);
      });

      it('provider resolves name', async () => {
        expect(await providerWithEns.resolveName('alex.mylogin.eth')).to.eq(userWallet.address);
      });

      it('reverse lookup with provider', async () => {
        expect(await providerWithEns.lookupAddress(userWallet.address)).to.eq('alex.mylogin.eth');
      });
    });
  });

  describe('Ethers.js', async () => {
    before(async () => {
      provider = createMockProvider();
      [userWallet, deployWallet] = await getWallets(provider);
      builder = new ENSBuilder(deployWallet);
    });

    describe('bootstrapWith', () => {
      before(async () => {
        const ensAddress = await builder.bootstrapWith('mylogin', 'eth');
        providerWithEns = withENS(provider, ensAddress);
        await builder.registerAddressWithReverse('alex', 'mylogin.eth', userWallet);
      });

      it('provider resolves name', async () => {
        expect(await providerWithEns.resolveName('alex.mylogin.eth')).to.eq(userWallet.address);
      });

      it('reverse lookup with provider', async () => {
        expect(await providerWithEns.lookupAddress(userWallet.address)).to.eq('alex.mylogin.eth');
      });
    });

    describe('bootstrap and register name manually', () => {
      before(async () => {
        await builder.bootstrap();
        await builder.registerTLD('eth');
        await builder.registerReverseRegistrar();
        await builder.registerDomain('mylogin', 'eth');
        await builder.registerAddressWithReverse('alex', 'mylogin.eth', userWallet);
        providerWithEns = withENS(provider, builder.ens.address);
      });

      it('provider resolves name', async () => {
        expect(await providerWithEns.resolveName('alex.mylogin.eth')).to.eq(userWallet.address);
      });

      it('reverse lookup with provider', async () => {
        expect(await providerWithEns.lookupAddress(userWallet.address)).to.eq('alex.mylogin.eth');
      });
    });
  });
});
