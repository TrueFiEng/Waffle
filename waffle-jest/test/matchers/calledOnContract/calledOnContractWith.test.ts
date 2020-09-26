import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: calledOnContractWith', () => {
  it('checks that contract function with provided parameter was called', async () => {
    const {contract} = await setup();

    await contract.callWithParameter(1);

    expect('callWithParameter').toBeCalledOnContractWith(contract, [1]);
  });

  it('checks that contract function with provided multiple parameters was called', async () => {
    const {contract} = await setup();

    await contract.callWithParameters(2, 3);

    expect('callWithParameters').toBeCalledOnContractWith(contract, [2, 3]);
  });

  it('throws assertion error when contract function with parameter was not called', async () => {
    const {contract} = await setup();

    expect(
      () => expect('callWithParameter').toBeCalledOnContractWith(contract, [1])
    ).toThrowError('Expected contract function with parameters to be called');
  });

  it('checks that contract function with parameter was not called', async () => {
    const {contract} = await setup();

    await contract.callWithParameter(2);

    expect('callWithParameter').not.toBeCalledOnContractWith(contract, [1]);
  });

  it('checks that contract function with parameters was not called', async () => {
    const {contract} = await setup();

    await contract.callWithParameters(1, 2);

    expect('callWithParameters').not.toBeCalledOnContractWith(contract, [1, 3]);
  });

  it('throws assertion error when contract function with parameter was called', async () => {
    const {contract} = await setup();
    await contract.callWithParameter(2);

    expect(
      () => expect('callWithParameter').not.toBeCalledOnContractWith(contract, [2])
    ).toThrowError('Expected contract function with parameters NOT to be called');
  });

  it(
    'checks that contract function was called on provided contract and not called on another deploy of this contract',
    async () => {
      const {contract} = await setup();
      const {contract: secondDeployContract} = await setup();
      await contract.callWithParameter(2);

      expect('callWithParameter').toBeCalledOnContractWith(contract, [2]);
      expect('callWithParameter').not.toBeCalledOnContractWith(secondDeployContract, [2]);
    }
  );

  it(
    'checks that contract function which was called twice with different args, lets possibility to find desirable call',
    async () => {
      const {contract} = await setup();

      await contract.callWithParameters(2, 3);
      await contract.callWithParameters(4, 5);

      expect('callWithParameters').toBeCalledOnContractWith(contract, [2, 3]);
    });
});
