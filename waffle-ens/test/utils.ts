import {providers, Wallet} from 'ethers';
import Ganache from 'ganache';

export const getWallet = (): Wallet => {
  const balance = '0x1ED09BEAD87C0378D8E6400000000'; // 10^34
  const secretKey = '0x03c909455dcef4e1e981a21ffb14c1c51214906ce19e8e7541921b758221b5ae';

  const defaultAccount = [{balance, secretKey}];

  const ganacheProvider = Ganache.provider({accounts: defaultAccount, logging: {quiet: true}});
  const provider = new providers.Web3Provider(ganacheProvider as any);
  return new Wallet(defaultAccount[0].secretKey, provider);
};
