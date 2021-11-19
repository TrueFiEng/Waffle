import {expect} from 'chai';
import {GethProvider} from '../src';
import {Wallet} from '@ethersproject/wallet';
import { Interface } from '@ethersproject/abi';
import { ContractFactory } from '@ethersproject/contracts';
import WETH from './contracts/WETH9.json'
import { utils } from 'ethers';

describe.only('GethProvider', () => {
  const provider = new GethProvider();
  const wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82');

  it('getBlockNumber', async () => {
    expect(await provider.getBlockNumber()).to.equal(0);
  });

  it('getBalance', async () => {
    const to = Wallet.createRandom().address;
    expect(await provider.getBalance(to)).to.equal(0);
    const tx = await wallet.signTransaction({
      to: to,
      value: 123,
      nonce: 0,
      gasPrice: 875000000,
      gasLimit: 21000
    });
    await provider.sendTransaction(tx);

    expect(await provider.getBlockNumber()).to.equal(1);

    expect(await provider.getBalance(to)).to.equal(123);
  });

  it('deploy WETH', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployData = weth.getDeployTransaction();
    const deployTx = await wallet.signTransaction({ ...deployData, nonce: 1, gasLimit: 100000, gasPrice: 765992500});
    await provider.sendTransaction(deployTx)
    expect(await provider.getBlockNumber()).to.equal(2);
    const depositData = contractInterface.encodeFunctionData('deposit');
    const address = utils.getContractAddress({from: wallet.address, nonce: 1});
    const value = utils.parseEther('1');
    const tx = await wallet.signTransaction({
      data: depositData,
      to: address,
      value,
      gasPrice: 865992500,
      gasLimit: 100000,
      nonce: 2
    });
    await provider.sendTransaction(tx)
    const balance = await provider.getBalance(address);
    expect(balance).to.eq(value);
  });

  it('get gas price', async () => {
    expect(await provider.getTransactionCount(wallet.address)).to.eq(0)
  })
});
