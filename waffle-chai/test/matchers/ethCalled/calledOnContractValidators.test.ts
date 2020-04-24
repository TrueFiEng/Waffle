import {expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {constants, Contract, ContractFactory, getDefaultProvider} from 'ethers';
import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';
import {EVENTS_ABI, EVENTS_BYTECODE} from '../../contracts/Events';

async function setup() {
  const provider = new MockProvider();
  const [deployer] = provider.getWallets();

  const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
  return {contract: await factory.deploy()};
}

describe('INTEGRATION: ethCalledValidators', () => {
  it('throws type error when the argument is not a contract', async () => {
    expect(
      () => expect('calledFunction').to.be.calledOnContract('invalidContract')
    ).to.throw(TypeError, 'ethCalled: argument must be a contract');
  });

  it('throws type error when the argument is not a provider', async () => {
    const contract = new Contract(
      constants.AddressZero,
      [],
      getDefaultProvider()
    );

    expect(
      () => expect('calledFunction').to.be.calledOnContract(contract)
    ).to.throw(TypeError, 'ethCalled: contract.provider must be a MockProvider');
  });

  it('throws type error when the provided function is not a string', async () => {
    const {contract} = await setup();

    expect(
      () => expect(12).to.be.calledOnContract(contract)
    ).to.throw(TypeError, 'ethCalled: function name must be a string');
  });

  it('throws type error when the provided function is not in the contract', async () => {
    const {contract} = await setup();

    expect(
      () => expect('notExistingFunction').to.be.calledOnContract(contract)
    ).to.throw(TypeError, 'ethCalled: function must exist in provided contract');
  });

  it('throws type error when the provided function is from another contract', async () => {
    const provider = new MockProvider();
    const [deployer] = provider.getWallets();
    const factory = new ContractFactory(EVENTS_ABI, EVENTS_BYTECODE, deployer);
    const anotherContract = await factory.deploy();
    await anotherContract.emitOne();

    const {contract} = await setup();

    expect(
      () => expect('notExistingFunction').to.be.calledOnContract(contract)
    ).to.throw(TypeError, 'ethCalled: function must exist in provided contract');
  });
});
