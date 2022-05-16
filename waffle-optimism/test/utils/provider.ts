import {JsonRpcProvider} from '@ethersproject/providers';
import {MockProvider} from 'ethereum-waffle';
import {BigNumber, Wallet} from 'ethers';

const privateKeys = [
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
  '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a'
];

export class OptimismProvider extends JsonRpcProvider {
  getWallets(): Wallet[] {
    return privateKeys.map(key => new Wallet(key, this));
  }

  async getL1Fee(transactionHash: string): Promise<BigNumber> {
    const fullReceipt = await this.perform('getTransactionReceipt', {transactionHash});
    return BigNumber.from(fullReceipt.l1Fee);
  }
}

export const getOptimismProvider = (url = 'http://localhost:8545'): MockProvider => {
  const provider = new OptimismProvider(url);
  return provider as unknown as MockProvider;
};
