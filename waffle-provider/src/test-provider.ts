import type {BigNumber, providers, Wallet} from 'ethers';

export type TestProvider =
providers.BaseProvider
& {
  getWallets(): Wallet[];
  getL1Fee?(txHash: string): Promise<BigNumber>;
};
