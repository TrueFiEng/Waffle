import {utils, Contract, Wallet, constants} from 'ethers';
import {deployContract, waitToBeMined} from '../utils';
import ENSRegistry from './abi/ENSRegistry.json';
import PublicResolver from './abi/PublicResolver.json';
import FIFSRegistrar from './abi/FIFSRegistrar.json';
import ReverseRegistrar from './abi/ReverseRegistrar.json';
import {Registrars} from './ENSBuilderTypes';

const overrideOptions = {gasLimit: 120000};
const nullLogger = () => {};

class ENSBuilder {
  public deployer: Wallet;
  public registrars: Registrars = {};
  public logger: any;
  public ens: Contract;
  public adminRegistrar: Contract;
  public resolver: Contract;

  constructor(deployer: Wallet, logger = nullLogger) {
    this.deployer = deployer;
    this.logger = logger;
  }

  public async bootstrap() {
    const emptyNode = constants.HashZero;
    this.ens = await deployContract(this.deployer, ENSRegistry, []);
    this.logger(`    ENS deployed at: ${this.ens.address}`);
    this.adminRegistrar = await deployContract(this.deployer, FIFSRegistrar, [this.ens.address, emptyNode]);
    this.logger(`    Registrar deployed at: ${this.adminRegistrar.address}`);
    this.resolver = await deployContract(this.deployer, PublicResolver, [this.ens.address]);
    this.logger(`    Resolver deployed at: ${this.resolver.address}`);
    await waitToBeMined(await this.ens.setOwner(constants.HashZero, this.adminRegistrar.address));
  }

  public async registerTLD(tld: string) {
    const label = utils.keccak256(utils.toUtf8Bytes(tld));
    const ethNode = utils.namehash(tld);
    await waitToBeMined(await this.adminRegistrar.register(label, this.deployer.address, overrideOptions));
    await waitToBeMined(await this.ens.setResolver(ethNode, this.resolver.address));
    this.registrars[tld] = await deployContract(this.deployer, FIFSRegistrar, [this.ens.address, ethNode]);
    this.logger(`    TLD '${tld}' registrar deployed at: ${this.registrars[tld].address}`);
    await waitToBeMined(await this.ens.setOwner(ethNode, this.registrars[tld].address));
  }

  public async registerReverseRegistrar() {
    await this.registerTLD('reverse');
    const label = 'addr';
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const deployArgs = [this.ens.address, this.resolver.address];
    this.registrars['addr.reverse'] = await deployContract(this.deployer, ReverseRegistrar, deployArgs);
    this.logger(`    Reverse registrar deployed at: ${this.registrars['addr.reverse'].address}`);
    const reverseContractAddress = this.registrars['addr.reverse'].address;
    await waitToBeMined(await this.registrars.reverse.register(labelHash, reverseContractAddress, overrideOptions));
  }

  public async registerDomain(label: string, domain: string) {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const newDomain = `${label}.${domain}`;
    const node = utils.namehash(newDomain);
    await waitToBeMined(await this.registrars[domain].register(labelHash, this.deployer.address, overrideOptions));
    await waitToBeMined(await this.ens.setResolver(node, this.resolver.address));
    this.registrars[newDomain] = await deployContract(this.deployer, FIFSRegistrar, [this.ens.address, node]);
    this.logger(`    ${newDomain} registrar deployed at: ${this.registrars[newDomain].address}`);
    await waitToBeMined(await this.ens.setOwner(node, this.registrars[newDomain].address));
    return this.registrars[newDomain];
  }

  public async registerAddress(label: string, domain: string, address: string) {
    const node = utils.namehash(`${label}.${domain}`);
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    await waitToBeMined(await this.registrars[domain].register(hashLabel, this.deployer.address, overrideOptions));
    await waitToBeMined(await this.ens.setResolver(node, this.resolver.address));
    await waitToBeMined(await this.resolver.setAddr(node, address));
  }

  public async registerAddressWithReverse(label: string, domain: string, wallet: Wallet) {
    await this.registerAddress(label, domain, wallet.address);
    const reverseContract = this.registrars['addr.reverse'];
    await waitToBeMined(await reverseContract.connect(wallet).setName(`${label}.${domain}`, overrideOptions));
  }

  public async bootstrapWith(label: string, domain: string) {
    await this.bootstrap();
    this.logger(`Registering TLD...`);
    await this.registerTLD(domain);
    this.logger(`Registering reverse registrar...`);
    await this.registerReverseRegistrar();
    this.logger(`Registering ${label}.${domain} domain...`);
    await this.registerDomain(label, domain);
    return this.ens.address;
  }
}

export default ENSBuilder;
