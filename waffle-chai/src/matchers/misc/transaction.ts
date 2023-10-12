import type {Transaction, Provider} from 'ethers';

export type MaybePendingTransaction = Promise<Transaction> | Transaction | string;

export async function waitForPendingTransaction(tx: MaybePendingTransaction, provider: Provider) {
  let hash: string | null;
  if (tx instanceof Promise) {
    ({hash} = await tx);
  } else if (typeof tx === 'string') {
    hash = tx;
  } else {
    ({hash} = tx);
  }
  if (!hash) {
    throw new Error(`${tx} is not a valid transaction`);
  }
  return provider.waitForTransaction(hash);
}
