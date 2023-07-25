import type {Provider, Wallet} from 'ethers';

export type TestProvider =
Provider
& {
  getWallets(): Wallet[];
  getL1Fee?(txHash: string): Promise<bigint>;
};
