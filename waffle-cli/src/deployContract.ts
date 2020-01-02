import {Wallet, providers, ContractFactory} from 'ethers';
import {ContractJSON, isStandard, hasByteCode} from './ContractJSON';

const defaultDeployOptions = {
  gasLimit: 4000000,
  gasPrice: 9000000000
};

export async function deployContract(
  wallet: Wallet,
  contractJSON: ContractJSON,
  args: any[] = [],
  overrideOptions: providers.TransactionRequest = {}
) {
  const bytecode = isStandard(contractJSON) ? contractJSON.evm.bytecode : contractJSON.bytecode;
  if (!hasByteCode(bytecode)) {
    throw new Error('Cannot deploy contract with empty bytecode');
  }
  const factory = new ContractFactory(
    contractJSON.abi,
    bytecode,
    wallet
  );
  const contract = await factory.deploy(...args, {
    ...defaultDeployOptions,
    ...overrideOptions
  });
  await contract.deployed();
  return contract;
}
