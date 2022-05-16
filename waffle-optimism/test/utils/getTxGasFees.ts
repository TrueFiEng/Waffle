import {OptimismProvider} from './provider';

/*  needed to get fees for a single transaction on Optimism - it can be non constant
 *
 */
export const calculateL2TxGasFee = async (provider: OptimismProvider) => {
  const [sender, receiver] = provider.getWallets();
  const tx = await sender.sendTransaction({
    to: receiver.address,
    value: 200
  });
  const txReceipt = await tx.wait();
  const l1Fee = await provider.getL1Fee(txReceipt.transactionHash);
  const txGasFees = txReceipt.gasUsed.mul(tx.gasPrice ?? txReceipt.effectiveGasPrice).add(l1Fee).toNumber();
  return txGasFees;
};
