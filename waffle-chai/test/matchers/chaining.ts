import {expect} from 'chai';
import {Wallet, Contract, ContractFactory} from 'ethers';
import {MOCK_TOKEN_ABI, MOCK_TOKEN_BYTECODE} from '../contracts/MockToken';
import {COMPLEX_ABI, COMPLEX_BYTECODE} from '../contracts/Complex';

import {MockProvider} from '@ethereum-waffle/provider';

export const chainingMatchersTest = (provider: MockProvider) => {
  let sender: Wallet;
  let receiver: Wallet;
  let token: Contract;
  let tokenFactory: ContractFactory;
  let complex: Contract;
  let complexFactory: ContractFactory;

  before(async () => {
    const wallets = provider.getWallets();
    sender = wallets[0];
    receiver = wallets[1];
    tokenFactory = new ContractFactory(MOCK_TOKEN_ABI, MOCK_TOKEN_BYTECODE, sender);
    token = await tokenFactory.deploy('MockToken', 'Mock', 18, 1000000000);
    complexFactory = new ContractFactory(COMPLEX_ABI, COMPLEX_BYTECODE, sender);
    complex = await complexFactory.deploy(token.address);
  });

  it('Balances chaining different calls', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, { value: 200 });
    await expect(tx).to.changeTokenBalances(token, [sender, receiver], [-100, 100]);
    await expect(tx).to.changeEtherBalances([receiver], [200]);
    await expect(tx).to.emit(complex, 'TransferredEther').withArgs(200);
    await expect(tx).to.emit(complex, 'TransferredTokens').withArgs(100);
  });

  it('Balance chaining different calls', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, { value: 200 });
    await expect(tx).to.changeTokenBalance(token, sender, -100);
    await expect(tx).to.changeTokenBalance(token, receiver, 100);
    await expect(tx).to.changeEtherBalance(sender, -200);
    await expect(tx).to.changeEtherBalance(receiver, 200);
    await expect(tx).to.emit(complex, 'TransferredEther').withArgs(200);
    await expect(tx).to.emit(complex, 'TransferredTokens').withArgs(100);
  });

  // it.only('Balances chaining different calls', async () => {
  //   await token.approve(complex.address, 100);
  //   const tx = await complex.doEverything(receiver.address, 100, { value: 200 });
  //   await expect(tx)
  //     .to.changeTokenBalances(token, [sender, receiver], [-100, 100])
  //     .and.to.changeEtherBalances([receiver], [200])
  //     .and.to.emit(complex, 'TransferredEther').withArgs(200)
  //     .and.to.emit(complex, 'TransferredTokens').withArgs(100);
  // });
}