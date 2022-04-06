import {Contract} from 'ethers';
import {changeEtherBalanceTest} from './changeEtherBalanceTest';
import {BASE_FEE_PER_GAS, TX_GAS} from './constants';
import {describeMockProviderCases} from './MockProviderCases';

describeMockProviderCases('INTEGRATION: changeEtherBalance matcher2', (provider) => {
  const [sender, receiver] = provider.getWallets();
  const contract = new Contract(receiver.address, [], provider);
  const txGasFees = BASE_FEE_PER_GAS * TX_GAS;

  changeEtherBalanceTest({
    sender,
    receiver,
    contract,
    txGasFees
  })
});
