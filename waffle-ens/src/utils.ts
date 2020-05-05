import {ContractFactory, utils, Wallet} from 'ethers';

const {namehash} = utils;

export const COIN_TYPE_ETH = 60;

export const deployContract = async (wallet: Wallet, contractJSON: any, args: Array<any>) => {
  const factory = new ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);
  return factory.deploy(...args);
};

interface ENSDomainInfo {
  chunks: string [];
  tld: string;
  rawLabel: string;
  label: string;
  node: string;
  rootNode: string;
}

export const getDomainInfo = (domain: string): ENSDomainInfo => {
  const chunks = domain.split('.');
  return {
    chunks,
    tld: chunks[chunks.length - 1],
    rawLabel: chunks[0],
    label: utils.id(chunks[0]),
    node: namehash(domain),
    rootNode: domain.replace(chunks[0] + '.', '')
  };
};
