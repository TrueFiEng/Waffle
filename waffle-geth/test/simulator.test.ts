import { Simulator } from '../src/simulator';
import { expect } from 'chai';
import { Wallet, utils, ContractFactory } from 'ethers';
import WETH from './contracts/WETH9.json'

const wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82');

describe.only('Simulator', () => {
  it('block number is 0 initially', () => {
    const simulator = new Simulator();
    expect(simulator.getBlockNumber()).to.eq('0');
  })

  it('block number is advanced by mined transactions', async () => {
    const simulator = new Simulator();
    const tx = await wallet.signTransaction({
      data: '0x',
      nonce: 0,
      gasPrice: 875000000,
      gasLimit: 1000000,
      value: 0,
    });
    simulator.sendTransaction(tx);
    expect(simulator.getBlockNumber()).to.eq('1');
  })

  it('sendTransaction returns a receipt', async () => {
    const simulator = new Simulator();
    const tx = await wallet.signTransaction({
      data: '0x',
      nonce: 0,
      gasPrice: 875000000,
      gasLimit: 1000000,
      value: 0,
    });
    const txParsed = utils.parseTransaction(tx);

    const receipt = simulator.sendTransaction(tx);
    expect(receipt.txHash).to.eq(txParsed.hash);
    expect(receipt.status).to.eq(1);
    expect(receipt.blockNumber).to.eq('1');
    expect(receipt.transactionIndex).to.eq(0);
  });

  it('can deploy WETH and wrap Ether', async () => {
    const simulator = new Simulator();

    const contractInterface = new utils.Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployTx = weth.getDeployTransaction();
    simulator.sendTransaction(await wallet.signTransaction({
      ...deployTx,
      gasPrice: 875000000,
      gasLimit: 1000000,
      nonce: 0,
    }))

    const depositData = contractInterface.encodeFunctionData('deposit');
    const address = utils.getContractAddress({from: wallet.address, nonce: 1});
    const value = utils.parseEther('1');
    const receipt = simulator.sendTransaction(await wallet.signTransaction({
      data: depositData,
      to: address,
      value,
      gasPrice: 875000000,
      gasLimit: 1000000,
      nonce: 1,
    }));
    expect(receipt.status).to.eq(1);
    // const balance = sim.getBalance(address);
    // expect(balance).to.eq(value);
  });
})