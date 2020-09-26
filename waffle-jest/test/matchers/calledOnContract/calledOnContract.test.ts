import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: calledOnContract', () => {
  it('checks that contract function was called', async () => {
    const {contract} = await setup();
    await contract.callWithoutParameter();

    expect('callWithoutParameter').toBeCalledOnContract(contract);
  });

  it('throws assertion error when contract function was not called', async () => {
    const {contract} = await setup();

    expect(
      () => expect('callWithoutParameter').toBeCalledOnContract(contract)
    ).toThrowError('Expected contract function to be called');
  });

  it('checks that contract function was not called', async () => {
    const {contract} = await setup();

    expect('callWithoutParameter').not.toBeCalledOnContract(contract);
  });

  it('throws assertion error when contract function was called', async () => {
    const {contract} = await setup();
    await contract.callWithoutParameter();

    expect(
      () => expect('callWithoutParameter').not.toBeCalledOnContract(contract)
    ).toThrowError('Expected contract function NOT to be called');
  });

  it(
    'checks that contract function was called on provided contract and not called on another deploy of this contract',
    async () => {
      const {contract} = await setup();
      const {contract: secondDeployContract} = await setup();
      await contract.callWithoutParameter();

      expect('callWithoutParameter').toBeCalledOnContract(contract);
      expect('callWithoutParameter').not.toBeCalledOnContract(secondDeployContract);
    }
  );
});
