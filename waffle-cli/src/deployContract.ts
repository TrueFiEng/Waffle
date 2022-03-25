import {providers, ContractFactory, Signer, Wallet, Contract} from 'ethers';
import {ContractJSON, isStandard, hasByteCode} from './ContractJSON';

type Newable<T> = { new(...args: any): T };

type ContractFactoryOrJSON = Newable<ContractFactory> | ContractJSON;

type ContractTypeOf<T> = T extends Newable<infer U>
  ? (U extends ContractFactory ? ReturnType<U['deploy']> : never)
  : Contract;
type DeployArgumentsOf<T> = T extends Newable<infer U>
  ? (U extends ContractFactory ? Parameters<U['deploy']> : never)
  : any[];

const isFactory = (contract: ContractFactoryOrJSON): contract is Newable<ContractFactory> =>
  'call' in contract;

export async function deployContract<T extends ContractFactoryOrJSON>(
  wallet: Wallet | Signer,
  factoryOrContractJson: T,
  args: DeployArgumentsOf<T> = [] as any,
  overrideOptions: providers.TransactionRequest = {}
): Promise<ContractTypeOf<T>> {
  if (isFactory(factoryOrContractJson)) {
    const Factory = factoryOrContractJson;
    const contractFactory = new Factory(wallet);
    const contract = await contractFactory.deploy(...args, overrideOptions);
    await contract.deployed();
    return contract as any;
  } else {
    const contract = await deployFromJson(wallet, factoryOrContractJson, args, overrideOptions);
    return contract as any;
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
