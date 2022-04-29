import {AssertionError, expect} from 'chai';
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

  it('Chaining balances different calls', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, {value: 200});
    await expect(tx).to.changeTokenBalances(token, [sender, receiver], [-100, 100]);
    await expect(tx).to.changeEtherBalances([sender, receiver], [-200, 200]);
    await expect(tx).to.emit(complex, 'TransferredEther').withArgs(200);
    await expect(tx).to.emit(complex, 'TransferredTokens').withArgs(100);
  });

  it('Chaining balances different calls some fail', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, {value: 200});
    await expect(
      expect(tx).to.changeTokenBalances(token, [sender, receiver], [-101, 101])
    ).to.be.eventually.rejectedWith(
      AssertionError,
      `Expected ${sender.address},${receiver.address} ` +
          'to change balance by -101,101 wei, but it has changed by -100,100 wei'
    );
    await expect(tx).to.changeEtherBalances([sender, receiver], [-200, 200]);
    await expect(
      expect(tx).to.emit(complex, 'TransferredEther').withArgs(201)
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected "200" to be equal 201'
    );
    await expect(tx).to.emit(complex, 'TransferredTokens').withArgs(100);
  });

  it('Balance chaining different calls', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, {value: 200});
    await expect(tx).to.changeTokenBalance(token, sender, -100);
    await expect(tx).to.changeTokenBalance(token, receiver, 100);
    await expect(tx).to.changeEtherBalance(sender, -200);
    await expect(tx).to.changeEtherBalance(receiver, 200);
    await expect(tx).to.emit(complex, 'TransferredEther').withArgs(200);
    await expect(tx).to.emit(complex, 'TransferredTokens').withArgs(100);
  });

  it('Balance chaining different calls some fail', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, {value: 200});
    await expect(
      expect(tx).to.changeTokenBalance(token, sender, -101)
    ).to.be.eventually.rejectedWith(
      AssertionError,
      `Expected "${sender.address}" to change balance by -101 wei, but it has changed by -100 wei`
    );
    await expect(tx).to.changeTokenBalance(token, receiver, 100);
    await expect(tx).to.changeEtherBalance(sender, -200);
    await expect(
      expect(tx).to.changeEtherBalance(receiver, 201)
    ).to.be.eventually.rejectedWith(
      AssertionError,
      `Expected "${receiver.address}" to change balance by 201 wei, but it has changed by 200 wei`
    );
    await expect(tx).to.emit(complex, 'TransferredEther').withArgs(200);
    await expect(
      expect(tx).not.to.emit(complex, 'TransferredTokens')
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected event "TransferredTokens" NOT to be emitted, but it was'
    );
  });

  it('Balances chaining one call', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, { value: 200 });
    await expect(tx)
      .to.changeTokenBalances(token, [sender, receiver], [-100, 100])
      .and.to.changeEtherBalances([sender, receiver], [-200, 200])
      .and.to.emit(complex, 'TransferredEther').withArgs(200)
      .and.to.emit(complex, 'TransferredTokens').withArgs(100);
  });

  it('Balances chaining one call first fail', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, { value: 200 });
    await expect(expect(tx)
      .to.changeTokenBalances(token, [sender, receiver], [-100, 101])
      .and.to.changeEtherBalances([sender, receiver], [-200, 200])
      .and.to.emit(complex, 'TransferredEther').withArgs(200)
      .and.to.emit(complex, 'TransferredTokens').withArgs(100)
    ).to.be.eventually.rejectedWith(
      AssertionError,
      `Expected ${sender.address},${receiver.address} ` +
        'to change balance by -100,101 wei, but it has changed by -100,100 wei'
    );
  });

  it('Balances chaining one call third fail', async () => {
    await token.approve(complex.address, 100);
    const tx = await complex.doEverything(receiver.address, 100, { value: 200 });
    await expect(expect(tx)
      .to.changeTokenBalances(token, [sender, receiver], [-100, 100])
      .and.to.changeEtherBalances([sender, receiver], [-200, 200])
      .and.to.emit(complex, 'TransferredEther').withArgs(199)
      .and.to.emit(complex, 'TransferredTokens').withArgs(100)
    ).to.be.eventually.rejectedWith(
      AssertionError,
      'Expected "200" to be equal 199'
    );
  });
};
