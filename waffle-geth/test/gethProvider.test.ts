import {expect} from 'chai';
import {GethProvider} from '../src';
import {Wallet} from '@ethersproject/wallet';
import { Interface } from '@ethersproject/abi';
import { Contract, ContractFactory } from '@ethersproject/contracts';
import WETH from './contracts/WETH9.json'
import { utils } from 'ethers';

describe('GethProvider', () => {
  const provider = new GethProvider();
  const wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82').connect(provider);

  it('getBlockNumber', async () => {
    expect(await provider.getBlockNumber()).to.equal(0);
  });

  it('getNetwork', async () => {
    const network = {
      name: 'undefined',
      chainId: 1337,
    }
    expect(await provider.getNetwork()).to.deep.equal(network);
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

  it('send ETH transfer', async () => {
    const to = Wallet.createRandom().address;

    await wallet.sendTransaction({
      to: to,
      value: 123,
      gasPrice: 875000000,
      gasLimit: 21000
    })

    expect(await provider.getBalance(to)).to.equal(123);
  })

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

  it('deploy WETH and call it', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployData = weth.getDeployTransaction();

    const deployTx = await wallet.signTransaction({ ...deployData, nonce: 0, gasLimit: 10000000, gasPrice: 875000000});
    await provider.sendTransaction(deployTx)

    const address = utils.getContractAddress({from: wallet.address, nonce: 0});
    const contract = new Contract(address, contractInterface, provider);

    const name = await contract.name();

    expect(name).to.eq('Wrapped Ether')
  });

  it('gets transaction count', async () => {
    expect(await provider.getTransactionCount(Wallet.createRandom().address)).to.eq(0)
  })

  it.skip('bench', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployData = weth.getDeployTransaction();

    let nonceCounter = 0;

    const start = Date.now()
    const COUNT = 1000;

    for(let i = 0; i < COUNT; i++) {
      const nonce = nonceCounter++

      const deployTx = await wallet.signTransaction({ ...deployData, nonce, gasLimit: 10000000, gasPrice: 875000000});
      await provider.sendTransaction(deployTx)

      const address = utils.getContractAddress({from: wallet.address, nonce });
      const contract = new Contract(address, contractInterface, provider);

      const name = await contract.name();

      expect(name).to.eq('Wrapped Ether')
    }

    const elapsed = Date.now() - start

    console.log({
      elapsed,
      perIter: elapsed / COUNT
    })

  });
});
