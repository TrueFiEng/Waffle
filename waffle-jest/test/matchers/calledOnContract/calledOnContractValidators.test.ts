import {MockProvider} from '@ethereum-waffle/provider';
import {
  constants,
  Contract,
  ContractFactory,
  getDefaultProvider
} from 'ethers';
import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';
import {validateMockProvider} from '../../../src/matchers/calledOnContract/calledOnContractValidators';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: ethCalledValidators', () => {
  it('throws type error when the argument is not a contract', async () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      () => expect('calledFunction').toBeCalledOnContract('invalidContract')
    ).toThrowError('argument must be a contract');
  });

  it('throws type error when the argument is not a provider', async () => {
    const contract = new Contract(
      constants.AddressZero,
      [],
      getDefaultProvider()
    );

    expect(() =>
      expect('calledFunction').toBeCalledOnContract(contract)
    ).toThrowError(
      'calledOnContract matcher requires provider that support call history'
    );
  });

  it('throws type error when the provided function is not a string', async () => {
    const {contract} = await setup();

    expect(() => expect(12).toBeCalledOnContract(contract)).toThrowError(
      'function name must be a string'
    );
  });

  it('throws type error when the provided function is not in the contract', async () => {
    const {contract} = await setup();

    expect(() =>
      expect('notExistingFunction').toBeCalledOnContract(contract)
    ).toThrowError('function must exist in provided contract');
  });
});

describe('UNIT: provider validation', () => {
  it('No call history in provider', async () => {
    expect(() => validateMockProvider(getDefaultProvider())).toThrowError(
      'calledOnContract matcher requires provider that support call history'
    );
  });

  it('Incorrect type of call history in provider', async () => {
    const provider = {callHistory: 'invalidType'};
    expect(() => validateMockProvider(provider)).toThrowError(
      'calledOnContract matcher requires provider that support call history'
    );
  });

  it('Correct type of call history in provider', () => {
    const provider = {callHistory: []};
    expect(() => validateMockProvider(provider)).not.toThrowError();
  });
});
