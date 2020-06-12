import {providers, ContractFactory, Signer} from 'ethers';
import {ContractJSON, isStandard, hasByteCode} from './ContractJSON';

const defaultDeployOptions = {
  gasLimit: 4000000,
  gasPrice: 9000000000
};

export async function deployContract(
  signer: Signer,
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
    signer
  );
  const contract = await factory.deploy(...args, {
    ...defaultDeployOptions,
    ...overrideOptions
  });
  await contract.deployed();
  return contract;
}
