declare namespace jest {
  interface Matchers<R> {
    // misc matchers
    toBeProperAddress(): R;
    toBeProperPrivateKey(): R;
    toBeProperHex(length: number): R;

    // BigNumber matchers
    toEqBN(value: number | string | BigNumber): R;
    toBeGtBN(value: number | string | BigNumber): R;
    toBeLtBN(value: number | string | BigNumber): R;
    toBeGteBN(value: number | string | BigNumber): R;
    toBeLteBN(value: number | string | BigNumber): R;

    // Balance matchers
    toChangeBalance(wallet: Wallet, balanceChange: number | string | BigNumber): R;
    toChangeBalances(wallets: Wallet[], balanceChanges: any[]): R;
  }
}
