import {changeEtherBalanceTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('Optimism: changeEtherBalance matcher', () => {
  const provider = getOptimismProvider();
  let txGasFees: number;

  before(async () => {
    const [sender, receiver] = provider.getWallets();
    const tx = await sender.sendTransaction({
      to: receiver.address,
      value: 200
    });
    const txReceipt = await tx.wait();
    const l1Fee = await (provider as any).getL1Fee(txReceipt.transactionHash);
    txGasFees = txReceipt.gasUsed.mul(tx.gasPrice ?? txReceipt.effectiveGasPrice).add(l1Fee).toNumber();
  });

  describe('changeEtherBalance matcher', () => {
    changeEtherBalanceTest(provider, {txGasFees: () => txGasFees, baseFeePerGas: 1});
  });
});
