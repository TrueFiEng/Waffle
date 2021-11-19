import {Interface} from '@ethersproject/abi';
import {ContractFactory} from '@ethersproject/contracts';
import {Wallet} from '@ethersproject/wallet';
import {BigNumberish} from '@ethersproject/bignumber';
import {expect} from 'chai';
import {constants, utils, BytesLike} from 'ethers';
import {cgoCurrentMillis, getBlockNumber, sendTransaction, library, call} from '../src/native';
import WETH from './contracts/WETH9.json';

describe('Native', () => {
  const wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82');
  it('can call a native function', () => {
    expect(cgoCurrentMillis()).to.be.a('number');
    expect(cgoCurrentMillis()).to.be.gt(0);
  });

  it('can get block number', () => {
    expect(getBlockNumber()).to.equal('1');
  });

  it('can send transactions', async () => {
    const wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82');
    const to = Wallet.createRandom().address;
    await helpSendTransaction(wallet, {
      to: to,
      value: 123,
      gasPrice: 875000000,
      gasLimit: 21000,
      nonce: 1,
    });

    expect(getBlockNumber()).to.equal('2');
    const balance = library.getBalance(to);
    expect(balance).to.eq('123');
  });

  it('can deploy WETH', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployTx = weth.getDeployTransaction();
    await helpSendTransaction(wallet, deployTx);
    expect(getBlockNumber()).to.equal('3');
    const depositData = contractInterface.encodeFunctionData('deposit');
    const address = utils.getContractAddress({from: wallet.address, nonce: 1});
    const value = utils.parseEther('1');
    await helpSendTransaction(wallet, {
      data: depositData,
      to: address,
      value
    });
    const balance = library.getBalance(address);
    expect(balance).to.eq(value);
  });

  it('can deploy WETH and call it', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployTx = weth.getDeployTransaction();
    await helpSendTransaction(wallet, deployTx);
    const address = await utils.getContractAddress({from: wallet.address, nonce: 2});

    const res = call({
      to: address,
      data: contractInterface.encodeFunctionData('name'),
    })
    console.log({ res })
    const name = contractInterface.decodeFunctionResult('name', "0x" + res!)
    console.log({ name })
  });
});

interface TxParams {
  data?: BytesLike;
  nonce?: BigNumberish;
  gasPrice?: BigNumberish;
  gasLimit?: BigNumberish;
  value?: BigNumberish;
  to?: string;
}

let nonce = 1;

async function helpSendTransaction(wallet: Wallet, params: TxParams) {
  const tx = await wallet.signTransaction({
    data: '0x',
    nonce,
    gasPrice: 875000000,
    gasLimit: 1000000,
    value: 0,
    ...params
  });
  await sendTransaction(tx);
  nonce++;
}
