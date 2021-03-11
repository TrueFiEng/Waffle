import {providers, ContractFactory, Signer, Wallet, Contract} from 'ethers';
import {ContractJSON, isStandard, hasByteCode} from './ContractJSON';

type Newable<T> = { new(...args: any[]): T };

export function deployContract(
  signer: Signer,
  contractJSON: ContractJSON,
  args?: any[],
  overrideOptions?: providers.TransactionRequest
): Promise<Contract>

export async function deployContract<T extends ContractFactory>(
  wallet: Wallet,
  Factory: Newable<T>,
  args: Parameters<T['deploy']>,
  overrideOptions?: providers.TransactionRequest
): Promise<ReturnType<T['deploy']>>

export async function deployContract<T extends ContractFactory>(
  wallet: Wallet | Signer,
  factoryOrContractJson: Newable<T> | ContractJSON,
  args: Parameters<T['deploy']>| any[] = [],
  overrideOptions: providers.TransactionRequest = {}
): Promise<ReturnType<T['deploy']> | Contract> {
  if ('abi' in factoryOrContractJson) {
    return deployFromJson(wallet, factoryOrContractJson, args, overrideOptions);
  } else {
    const Factory = factoryOrContractJson as Newable<T>;
    const contractFactory = new Factory(wallet);
    const contract = await contractFactory.deploy(...args, overrideOptions);
    await contract.deployed();
    return contract;
  }
}

async function deployFromJson(
  wallet: Signer,
  contractJson: ContractJSON,
  args: any[],
  overrideOptions: providers.TransactionRequest) {
  const bytecode = isStandard(contractJson) ? contractJson.evm.bytecode : contractJson.bytecode;
  if (!hasByteCode(bytecode)) {
    throw new Error('Cannot deploy contract with empty bytecode');
  }
  const factory = new ContractFactory(
    contractJson.abi,
    bytecode,
    wallet
  );
  const contract = await factory.deploy(...args, {
    ...overrideOptions
  });
  await contract.deployed();
  return contract;
}
