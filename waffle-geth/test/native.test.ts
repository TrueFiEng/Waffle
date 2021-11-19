import {Interface} from '@ethersproject/abi';
import {ContractFactory} from '@ethersproject/contracts';
import {Wallet} from '@ethersproject/wallet';
import {BigNumberish} from '@ethersproject/bignumber';
import {expect} from 'chai';
import {BytesLike, utils} from 'ethers';
import WETH from './contracts/WETH9.json';
import {cgoCurrentMillis, Simulator} from '../src/native';

describe('Native', () => {
  const wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82');
  let sim: Simulator
  let nonce: number

  async function helpSendTransaction(wallet: Wallet, params: TxParams) {
    const tx = await wallet.signTransaction({
      data: '0x',
      nonce,
      gasPrice: 875000000,
      gasLimit: 1000000,
      value: 0,
      ...params
    });
    sim.sendTransaction(tx);
    nonce++;
  }

  beforeEach(async function () {
    sim = new Simulator()
    nonce = 0
  });

  it('can call a native function', () => {
    expect(cgoCurrentMillis()).to.be.a('number');
    expect(cgoCurrentMillis()).to.be.gt(0);
  });

  it('can get block number', () => {
    expect(sim.getBlockNumber()).to.equal('0');
  });

  it('can send transactions', async () => {
    const to = Wallet.createRandom().address;
    await helpSendTransaction(wallet, {
      to,
      value: 123,
    });

    expect(sim.getBlockNumber()).to.equal('1');
    const balance = sim.getBalance(to);
    expect(balance).to.eq('123');
  });

  it('can deploy WETH and wrap Ether', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployTx = weth.getDeployTransaction();
    await helpSendTransaction(wallet, deployTx);
    expect(sim.getBlockNumber()).to.equal('1');

    const depositData = contractInterface.encodeFunctionData('deposit');
    const address = utils.getContractAddress({from: wallet.address, nonce: 1});
    const value = utils.parseEther('1');
    await helpSendTransaction(wallet, {
      data: depositData,
      to: address,
      value
    });
    const balance = sim.getBalance(address);
    expect(balance).to.eq(value);
  });

  it('can deploy WETH and call it', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployTx = weth.getDeployTransaction();
    await helpSendTransaction(wallet, deployTx);
    const address = utils.getContractAddress({from: wallet.address, nonce: 0});

    const res = sim.call({
      to: address,
      data: contractInterface.encodeFunctionData('name'),
    })
    const [name] = contractInterface.decodeFunctionResult('name', res)
    expect(name).to.equal('Wrapped Ether')
  });

  it('can get network', async () => {
    expect(sim.getChainID()).to.equal('1337');
  })
});

interface TxParams {
  data?: BytesLike;
  nonce?: BigNumberish;
  gasPrice?: BigNumberish;
  gasLimit?: BigNumberish;
  value?: BigNumberish;
  to?: string;
}


