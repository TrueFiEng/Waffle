import {changeEtherBalancesTest} from '@ethereum-waffle/chai/test';
import {getOptimismProvider} from './utils/provider';

describe('Optimism: changeEtherBalances matcher', () => {
  const provider = getOptimismProvider();
  let txGasFees: number;

  // needed to get fees for a single transaction on Optimism - it can be non constant
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

  changeEtherBalancesTest(provider, {txGasFees: () => txGasFees, baseFeePerGas: 1});
});
