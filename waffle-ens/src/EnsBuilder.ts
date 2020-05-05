import {ENSRegistry, FIFSRegistrar} from '@ensdomains/ens';
import {PublicResolver} from '@ensdomains/resolver';
import {constants, Contract, utils, Wallet} from 'ethers';
import {COIN_TYPE_ETH, deployContract, getDomainInfo} from './utils';

const {namehash} = utils;
const {HashZero} = constants;

export async function createENSBuilder(wallet: Wallet) {
  const ens = await deployContract(wallet, ENSRegistry, []);
  const resolver = await deployContract(wallet, PublicResolver, [ens.address]);
  const resolverNode = namehash('resolver');
  const resolverLabel = utils.id('resolver');
  await ens.setSubnodeOwner(HashZero, resolverLabel, wallet.address);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver.setAddr(resolverNode, COIN_TYPE_ETH, resolver.address);
  return new ENSBuilder(wallet, ens, resolver);
}

export class ENSBuilder {
  wallet: Wallet;
  ens: Contract;
  resolver: Contract;
  registrars: Record<string, Contract>;

  constructor(wallet: Wallet, ens: Contract, resolver: Contract) {
    this.wallet = wallet;
    this.ens = ens;
    this.resolver = resolver;
  }

  async createTopLevelDomain(domain: string) {
    const {node, label} = getDomainInfo(domain);
    this.registrars = {
      ...this.registrars,
      [domain]: await deployContract(this.wallet, FIFSRegistrar, [this.ens.address, node])
    };
    await this.ens.setSubnodeOwner(HashZero, label, this.registrars[domain].address);
  }

  async createSubDomain(domain: string) {
    const {tld, label, node} = getDomainInfo(domain);
    await this.registrars[tld].register(label, this.wallet.address);
    await this.ens.setResolver(node, this.resolver.address);
    const registrar: Contract = await deployContract(this.wallet, FIFSRegistrar, [this.ens.address, node]);
    await this.ens.setOwner(node, registrar.address);
    this.registrars = {
      ...this.registrars,
      [domain]: registrar
    };
  }

  async findRegistrar(rootNode: string) {
    return this.registrars[rootNode];
  }

  async setAddress(domain: string, address: string) {
    const {node, label, rootNode} = getDomainInfo(domain);
    const registrar = await this.findRegistrar(rootNode);
    await registrar.register(label, this.wallet.address);
    await this.ens.setResolver(node, this.resolver.address);
    await this.resolver.setAddr(node, COIN_TYPE_ETH, address);
  }
}
