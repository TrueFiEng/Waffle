import {expect} from 'chai';
import {BigNumber, constants, utils, Wallet} from 'ethers';
import {MockProvider} from '../src/MockProvider';
import {deployToken} from './BasicToken';
import {ENS} from '@ethereum-waffle/ens';

const {AddressZero} = constants;
const {namehash} = utils;
const noExistingNode = '0x0000000000000000000000000000000000000000000000000000000000000001';

describe('INTEGRATION: MockProvider', () => {
  it('can return wallets', async () => {
    const provider = new MockProvider();
    const wallets = provider.getWallets();

    expect(wallets.length).to.equal(10);
    for (const wallet of wallets) {
      const balance = await wallet.getBalance();

      expect(balance.gt(0)).to.equal(true);
      expect(wallet.provider).to.equal(provider);
    }
  });

  it('accepts options', () => {
    const original = Wallet.createRandom();
    const provider = new MockProvider({
      accounts: [{balance: '100', secretKey: original.privateKey}]
    });
    const wallets = provider.getWallets();
    expect(wallets.length).to.equal(1);
    expect(wallets[0].address).to.equal(original.address);
  });

  it('can send simple transactions', async () => {
    const provider = new MockProvider();
    const [sender] = provider.getWallets();
    const recipient = provider.createEmptyWallet();

    const value = utils.parseEther('3.1415');

    await sender.sendTransaction({
      to: recipient.address,
      value
    });

    const balance = await recipient.getBalance();
    expect(balance.eq(value)).to.equal(true);
  });

  it('can query a contract', async () => {
    const [wallet] = new MockProvider().getWallets();
    const contract = await deployToken(wallet, 10_000);

    const totalSupply: BigNumber = await contract.totalSupply();
    expect(totalSupply.eq(10_000)).to.equal(true);
  });

  it('can send a contract transaction', async () => {
    const [sender, recipient] = new MockProvider().getWallets();
    const contract = await deployToken(sender, 10_000);

    await contract.transfer(recipient.address, 3_141);
    const balance = await contract.balanceOf(recipient.address);

    expect(balance.eq(3_141)).to.equal(true);
  });

  describe('Deploy Ens', async () => {
    const provider = new MockProvider();
    const [wallet] = provider.getWallets();
    let ens: ENS;

    beforeEach(async () => {
      ens = await provider.setupENS(wallet);
      await ens.createTopLevelDomain('test');
    });

    it('ENS deployed', async () => {
      expect(await ens.ens.owner(noExistingNode)).to.equal(AddressZero);
    });

    it('PublicResolver deployed and setup', async () => {
      expect(await ens.ens.resolver(namehash('resolver'))).to.eq(ens.resolver.address);
      expect(await ens.ens.owner(namehash('resolver'))).to.eq(wallet.address);
      expect(await ens.resolver['addr(bytes32)'](namehash('resolver'))).to.eq(ens.resolver.address);
    });

    it('ReverseRegistrar deployed and setup', async () => {
      expect(await ens.ens.owner(namehash('reverse'))).to.eq(wallet.address);
      expect(await ens.ens.owner(namehash('addr.reverse'))).to.eq(ens.reverseRegistrar.address);
    });
    describe('Create domain', async () => {
      describe('Non recursive', async () => {
        it('top level domain', async () => {
          const node = namehash('tld');
          await ens.createTopLevelDomain('tld');
          expect(await ens.ens.owner(node)).to.eq(ens.registrars['tld'].address);
        });

        it('sub domain', async () => {
          const node = namehash('ethworks.test');
          await ens.createSubDomain('ethworks.test');
          expect(await ens.ens.owner(node)).to.eq(ens.registrars['ethworks.test'].address);
          expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
        });

        it('third level domain', async () => {
          await ens.createSubDomain('ethworks.test');
          const node = namehash('dev.ethworks.test');
          await ens.createSubDomain('dev.ethworks.test');
          expect(await ens.ens.owner(node)).to.eq(ens.registrars['dev.ethworks.test'].address);
          expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
        });
      });

      describe('Recursive', async () => {
        it('third level domain', async () => {
          const node = namehash('waffle.projects.tld');
          await ens.createSubDomain('waffle.projects.tld', {recursive: true});
          expect(await ens.ens.owner(node)).to.eq(ens.registrars['waffle.projects.tld'].address);
          expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
        });
      });

      describe('Fail', async () => {
        it('third level domain for nonexistent second level domain', async () => {
          await expect(ens.createSubDomain('ens.nonexistent.test'))
            .to.be.rejectedWith('Domain nonexistent.test doesn\'t exist.');
        });
      });
    });

    describe('Set address', async () => {
      describe('Non recursive', async () => {
        it('existing domain', async () => {
          const node = namehash('vlad.ethworks.test');
          await ens.createSubDomain('ethworks.test');
          await ens.setAddress('vlad.ethworks.test', ens.wallet.address);
          expect(await ens.ens.owner(node)).to.eq(ens.wallet.address);
          expect(await ens.resolver['addr(bytes32)'](node)).to.eq(ens.wallet.address);
          expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
        });
      });

      describe('Reverse', async () => {
        it('reverse registrar', async () => {
          await ens.setReverseName(wallet, 'vlad');
          const node = namehash(wallet.address.slice(2) + '.addr.reverse');
          expect(await ens.ens.owner(node)).to.eq(ens.reverseRegistrar.address);
          expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
        });
      });

      describe('Recursive', async () => {
        it('nonexistent domain', async () => {
          const node = namehash('vlad.test.tld');
          await ens.setAddress('vlad.test.tld', ens.wallet.address, {recursive: true});
          expect(await ens.ens.owner(node)).to.eq(ens.wallet.address);
          expect(await ens.resolver['addr(bytes32)'](node)).to.eq(ens.wallet.address);
          expect(await ens.ens.resolver(node)).to.eq(ens.resolver.address);
        });
      });

      describe('Fail', async () => {
        it('nonexistent domain', async () => {
          await expect(ens.setAddress('vlad.nonexistent.test', ens.wallet.address))
            .to.be.rejectedWith('Domain nonexistent.test doesn\'t exist.');
        });
      });
    });
  });
});
