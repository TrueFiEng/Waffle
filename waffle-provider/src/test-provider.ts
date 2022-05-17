import type {BigNumber, providers, Wallet} from 'ethers';

export type TestProvider =
(providers.Web3Provider | providers.JsonRpcProvider)
& {
  getWallets(): Wallet[];
  getL1Fee?(txHash: string): Promise<BigNumber>;
};
