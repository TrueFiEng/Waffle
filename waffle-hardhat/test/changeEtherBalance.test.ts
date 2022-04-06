import chai from 'chai';
import {Contract, Wallet} from 'ethers';
import {waffle} from 'hardhat';
import {MockProvider} from 'ethereum-waffle';
import chaiAsPromised from 'chai-as-promised';
import {changeEtherBalanceTest} from '@ethereum-waffle/chai/test';
import {BASE_FEE_PER_GAS, TX_GAS} from './constants';

chai.use(chaiAsPromised);

describe('INTEGRATION: changeEtherBalance matcher', () => {
  const provider = waffle.provider as MockProvider;
  let sender: Wallet;
  let receiver: Wallet;
  let contract: Contract;
  let txGasFees: number;

  before(async () => {
    await provider.send('hardhat_reset', []);
    const wallets = provider.getWallets();
    sender = wallets[0];
    receiver = wallets[1];
    contract = new Contract(receiver.address, [], provider);
    txGasFees = BASE_FEE_PER_GAS * TX_GAS;
  });

  describe('INTEGRATION: changeEtherBalance matcher', () => {
    changeEtherBalanceTest({
      sender,
      receiver,
      contract,
      txGasFees
    });
  });
});
