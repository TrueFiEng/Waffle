import {expect} from 'chai';
import { MockProvider } from "@ethereum-waffle/provider";
import { constants, Contract, ContractFactory, getDefaultProvider, Wallet } from "ethers";

import {CALLS_ABI, CALLS_BYTECODE} from '../../contracts/Calls';
import {validateMockProvider} from '../../../src/matchers/calledOnContract/calledOnContractValidators';

export const calledOnContractValidatorsTest = (provider: MockProvider) => {
  const setup = async (provider: MockProvider) => {
    const [deployer] = provider.getWallets();
  
    const factory = new ContractFactory(CALLS_ABI, CALLS_BYTECODE, deployer);
    return {contract: await factory.deploy()};
  }

  let deployer: Wallet;

  before(async () => {
    const wallets = provider.getWallets();
    deployer = wallets[0];
  });

  it('throws type error when the argument is not a contract', async () => {
    expect(
      () => expect('calledFunction').to.be.calledOnContract('invalidContract')
    ).to.throw(TypeError, 'argument must be a contract');
  });

  it('throws type error when the argument is not a provider', async () => {
    const contract = new Contract(
      constants.AddressZero,
      [],
      getDefaultProvider()
    );

    expect(
      () => expect('calledFunction').to.be.calledOnContract(contract)
    ).to.throw('calledOnContract matcher requires provider that support call history');
  });

  it('throws type error when the provided function is not a string', async () => {
    const {contract} = await setup(provider);

    expect(
      () => expect(12).to.be.calledOnContract(contract)
    ).to.throw(TypeError, 'function name must be a string');
  });

  it('throws type error when the provided function is not in the contract', async () => {
    const {contract} = await setup(provider);

    expect(
      () => expect('notExistingFunction').to.be.calledOnContract(contract)
    ).to.throw(TypeError, 'function must exist in provided contract');
  });

  describe('UNIT: provider validation', () => {
    it('No call history in provider', async () => {
      expect(() => validateMockProvider(getDefaultProvider()))
        .to.throw('calledOnContract matcher requires provider that support call history');
    });
  
    it('Incorrect type of call history in provider', async () => {
      const provider = {callHistory: 'invalidType'};
      expect(() => validateMockProvider(provider))
        .to.throw('calledOnContract matcher requires provider that support call history');
    });
  
    it('Correct type of call history in provider', () => {
      const provider = {callHistory: []};
      expect(() => validateMockProvider(provider))
        .to.not.throw();
    });
  });
};
