/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="chai" />
// I cannot get ethers types to work for some reason

declare namespace Chai {
  interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
    reverted: AsyncAssertion;
    revertedWith(reason: string): AsyncAssertion;
    emit(contract: any, eventName: string): EmitAssertion;
    properHex(length: number): void;
    properPrivateKey: void;
    properAddress: void;
    changeBalance(wallet: any, balance: any): AsyncAssertion;
    changeBalances(wallets: any[], balances: any[]): AsyncAssertion;
    calledOnContract(contract: any): void;
    calledOnContractWith(contract: any, parameters: any[]): void;
  }

  interface NumberComparer {
    (value: any, message?: string): Assertion;
  }

  interface AsyncAssertion extends Assertion, Promise<void> {
  }

  interface EmitAssertion extends AsyncAssertion {
    withArgs(...args: any[]): AsyncAssertion;
  }
}
