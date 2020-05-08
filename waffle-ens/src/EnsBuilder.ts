import {ENSRegistry, FIFSRegistrar} from '@ensdomains/ens';
import {PublicResolver} from '@ensdomains/resolver';
import {constants, Contract, utils, Wallet} from 'ethers';
import {COIN_TYPE_ETH, deployContract, getDomainInfo} from './utils';

const {namehash} = utils;
const {HashZero} = constants;

interface DomainRegistrationOptions {
  recursive?: boolean;
}

export async function createENSBuilder(wallet: Wallet) {
  const ens = await deployContract(wallet, ENSRegistry, []);
  const resolver = await deployContract(wallet, PublicResolver, [ens.address]);
  const resolverNode = namehash('resolver');
  const resolverLabel = utils.id('resolver');
  await ens.setSubnodeOwner(HashZero, resolverLabel, wallet.address);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver['setAddr(bytes32,uint256,bytes)'](resolverNode, COIN_TYPE_ETH, resolver.address);
  return new ENSBuilder(wallet, ens, resolver);
}

export class ENSBuilder {
  wallet: Wallet;
  ens: Contract;
  resolver: Contract;
  registrars: Record<string, Contract> = {};

  constructor(wallet: Wallet, ens: Contract, resolver: Contract) {
    this.wallet = wallet;
    this.ens = ens;
    this.resolver = resolver;
  }

  async createTopLevelDomain(domain: string) {
    const node = namehash(domain);
    this.registrars = {
      ...this.registrars,
      [domain]: await deployContract(this.wallet, FIFSRegistrar, [this.ens.address, node])
    };
    await this.ens.setSubnodeOwner(HashZero, utils.id(domain), this.registrars[domain].address);
  }

  async createSubDomain(domain: string, options?: DomainRegistrationOptions) {
    const recursive = options?.recursive || false;
    const {label, node, decodedRootNode, chunks} = getDomainInfo(domain);
    try {
      await this.registrars[decodedRootNode].register(label, this.wallet.address);
      await this.ens.setResolver(node, this.resolver.address);
      const registrar: Contract = await deployContract(this.wallet, FIFSRegistrar, [this.ens.address, node]);
      await this.ens.setOwner(node, registrar.address);
      this.registrars = {
        ...this.registrars,
        [domain]: registrar
      };
    } catch (e) {
      if (recursive) {
        if (chunks.length > 1) {
          await this.createSubDomain(decodedRootNode, {recursive: true});
        } else {
          await this.createTopLevelDomain(decodedRootNode);
        }
        await this.createSubDomain(domain, options);
      } else {
        throw new Error(
          `Top level domain ${decodedRootNode} doesn't exist.`
        );
      }
    }
  }

  async findRegistrar(rootNode: string) {
    return this.registrars[rootNode];
  }

  async setAddress(domain: string, address: string, options?: DomainRegistrationOptions) {
    const recursive = options?.recursive || false;
    const {node, label, decodedRootNode} = getDomainInfo(domain);
    try {
      const registrar = await this.findRegistrar(decodedRootNode);
      await registrar.register(label, this.wallet.address);
      await this.ens.setResolver(node, this.resolver.address);
      await this.resolver['setAddr(bytes32,uint256,bytes)'](node, COIN_TYPE_ETH, address);
    } catch (e) {
      if (recursive) {
        await this.createSubDomain(decodedRootNode);
        await this.setAddress(domain, address, options);
      } else {
        throw new Error(
          `Domain ${decodedRootNode} doesn't exist.`
        );
      }
    }
  }
}
