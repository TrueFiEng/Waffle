import { MockProvider } from './MockProvider';

export type TestProvider =
MockProvider
& {
  getL1Fee?(txHash: string): Promise<bigint>;
};
