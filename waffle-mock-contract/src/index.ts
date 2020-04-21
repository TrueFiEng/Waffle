import {Contract, ContractFactory, utils, Wallet} from 'ethers';
import {MockProvider, VMStep} from '@ethereum-waffle/provider';
import DoppelgangerContract from './Doppelganger.json';

type ABI = Array<utils.EventFragment | utils.FunctionFragment | utils.ParamType> | string;

export interface CallRecord {
  sighash: string;
  args: string;
}

export type Stub = ReturnType<typeof stub>;

export interface MockContract extends Contract {
  mock: {
    [key: string]: Stub;
  };
}

async function deploy(wallet: Wallet) {
  const factory = new ContractFactory(DoppelgangerContract.abi, DoppelgangerContract.bytecode, wallet);
  return factory.deploy();
}

function getCallArgsForFunction(
  func: utils.FunctionDescription, encoder: utils.AbiCoder, callHistory: CallRecord[]
): any[][] {
  return callHistory
    .filter(({sighash}) => sighash === func.sighash)
    .map(({args}) => encoder.decode(func.inputs, args));
}

function stub(
  mockContract: Contract,
  encoder: utils.AbiCoder,
  func: utils.FunctionDescription,
  callHistory: CallRecord[],
  params?: any[]
) {
  const callData = params ? func.encode(params) : func.sighash;

  return {
    returns: async (...args: any) => {
      const encoded = encoder.encode(func.outputs, args);
      await mockContract.__waffle__mockReturns(callData, encoded);
    },
    reverts: async () => mockContract.__waffle__mockReverts(callData),
    withArgs: (...args: any[]) => stub(mockContract, encoder, func, callHistory, args),
    callHistory: () => getCallArgsForFunction(func, encoder, callHistory)
  };
}

function extractArgsFromMemory(bytes: number[]) {
  // skip 160 bytes + 4 bytes of signature
  const padding = 160 + 4;
  return `0x${Buffer.from(bytes.slice(padding)).toString('hex')}`;
}

function subscribeToMockCalls(provider: MockProvider, doppelgangerAddress: string, callHistory: CallRecord[]) {
  const addressWithout0x = doppelgangerAddress.slice(2).toLowerCase();

  provider.on('vm_step', (step: VMStep) => {
    if (step.opcode.name !== 'STATICCALL') {
      return;
    }
    if (step.address.toString('hex') !== addressWithout0x) {
      return;
    }
    // Types for BigNumber are broken (toString doesn't expect argument)
    callHistory.push({
      sighash: `0x${(step.stack[0] as any).toString(16)}`,
      args: extractArgsFromMemory(step.memory)
    });
  });
}

function createMock(abi: ABI, mockContractInstance: Contract, callHistory: CallRecord[]) {
  const {functions} = new utils.Interface(abi);
  const encoder = new utils.AbiCoder();

  return Object.values(functions).reduce((acc, func) => ({
    ...acc,
    [func.name]: stub(mockContractInstance, encoder, func, callHistory)
  }), {} as MockContract['mock']);
}

export async function deployMockContract(wallet: Wallet, abi: ABI): Promise<MockContract> {
  console.warn(
    'deployMockContract is an experimental feature. ' +
    'Breaking changes will not result in a new major version'
  );
  const mockContractInstance = await deploy(wallet);

  const callHistory: CallRecord[] = [];
  subscribeToMockCalls(wallet.provider as MockProvider, mockContractInstance.address, callHistory);

  const mock = createMock(abi, mockContractInstance, callHistory);
  const mockedContract = new Contract(mockContractInstance.address, abi, wallet) as MockContract;
  mockedContract.mock = mock;

  return mockedContract;
}
