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
  decodedRootNode: string;
}

export const getDomainInfo = (domain: string): ENSDomainInfo => {
  const chunks = domain.split('.');

  if (chunks.length === 1 && chunks[0].length > 0) {
    throw new Error(
      'Invalid domain. Please, enter no top level domain.'
    );
  } else if (chunks.includes('')) {
    throw new Error(
      `Invalid domain: '${domain}'`
    );
  }
  try {
    namehash(domain);
  } catch (e) {
    throw new Error(
      `Invalid domain: '${domain}'`
    );
  }

  return {
    chunks,
    tld: chunks[chunks.length - 1],
    rawLabel: chunks[0],
    label: utils.id(chunks[0]),
    node: namehash(domain),
    rootNode: namehash(domain.replace(chunks[0] + '.', '')),
    decodedRootNode: domain.replace(chunks[0] + '.', '')
  };
};
