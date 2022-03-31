import {expect} from 'chai';
import {GethProvider} from '../src';
import {Wallet} from '@ethersproject/wallet';
import {Interface} from '@ethersproject/abi';
import {Contract, ContractFactory} from '@ethersproject/contracts';
import WETH from './contracts/WETH9.json'
import {BigNumber, utils} from 'ethers';

describe('GethProvider', () => {
  let provider: GethProvider
  let wallet: Wallet

  beforeEach(async function () {
    provider = new GethProvider();
    wallet = new Wallet('0xee79b5f6e221356af78cf4c36f4f7885a11b67dfcc81c34d80249947330c0f82').connect(provider);
  });

  it('getBlockNumber', async () => {
    expect(await provider.getBlockNumber()).to.equal(0);
  });

  it('getBlock', async () => {
    const block = await provider.getBlock('0');
    expect(block.timestamp).to.be.a('number')
    expect(block.difficulty).to.be.a('number')
    expect(block.hash).to.be.a('string')
    expect(block.number).to.be.equal(0)
  });

  it.skip('getNetwork', async () => {
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

  it.skip('send ETH transfer', async () => {
    const to = Wallet.createRandom().address;

    const tx = await wallet.sendTransaction({
      to: to,
      value: 123,
      gasPrice: 875000000,
      gasLimit: 21000
    })

    expect((await provider.getTransaction(tx.hash)).to?.toLowerCase()).to.equal(to.toLowerCase());

    expect(await provider.getBalance(to)).to.equal(123);
  })

  it.skip('deploy WETH', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployData = weth.getDeployTransaction();
    const deployTx = await wallet.signTransaction({...deployData, nonce: 0, gasLimit: 100000, gasPrice: 76599250000});
    await provider.sendTransaction(deployTx)
    expect(await provider.getBlockNumber()).to.equal(1);
    const depositData = contractInterface.encodeFunctionData('deposit');
    const address = utils.getContractAddress({from: wallet.address, nonce: 1});
    const value = utils.parseEther('1');
    const tx = await wallet.signTransaction({
      data: depositData,
      to: address,
      value,
      gasPrice: 86599250000,
      gasLimit: 100000,
      nonce: 1
    });
    await provider.sendTransaction(tx)
    const balance = await provider.getBalance(address);
    expect(balance).to.eq(value);
  });

  it.skip('deploy WETH and call it', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployData = weth.getDeployTransaction();

    const deployTx = await wallet.signTransaction({...deployData, nonce: 0, gasLimit: 10000000, gasPrice: 875000000});
    await provider.sendTransaction(deployTx)

    const address = utils.getContractAddress({from: wallet.address, nonce: 0});
    const contract = new Contract(address, contractInterface, provider);

    const name = await contract.name();

    expect(name).to.eq('Wrapped Ether')
  });

  it.skip('gets transaction count', async () => {
    expect(await provider.getTransactionCount(Wallet.createRandom().address)).to.eq(0)
  })

  it.skip('bench', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployData = weth.getDeployTransaction();

    let nonceCounter = 0;

    const start = Date.now()
    const COUNT = 1000;

    for (let i = 0; i < COUNT; i++) {
      const nonce = nonceCounter++

      const deployTx = await wallet.signTransaction({...deployData, nonce, gasLimit: 10000000, gasPrice: 875000000});
      await provider.sendTransaction(deployTx)

      const address = utils.getContractAddress({from: wallet.address, nonce});
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

  it.skip('getLogs', async () => {
    expect((await provider.getLogs({from: 0, to: 10})).length).to.eq(0)
    // deploy WETH
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployData = weth.getDeployTransaction();
    const deployTx = await wallet.signTransaction({ ...deployData, nonce: 0, gasLimit: 10000000, gasPrice: 875000000});
    await provider.sendTransaction(deployTx)

    //deposit ETH
    const depositData = contractInterface.encodeFunctionData('deposit');
    const address = utils.getContractAddress({from: wallet.address, nonce: 0});
    const value = utils.parseEther('1');
    const tx = await wallet.signTransaction({
      data: depositData,
      to: address,
      value,
      gasPrice: 865992500,
      gasLimit: 100000,
      nonce: 1
    });
    const receipt = await provider.sendTransaction(tx)

    const logs = await provider.getLogs({from: 0, to: await provider.getBlockNumber()})
    expect(logs.length).to.eq(1)
    expect(logs[0].address.toLowerCase()).to.eq(address.toLowerCase())
    expect(logs[0].transactionHash).to.eq(receipt.hash)
  })

  it.skip('getCode', async () => {
    const contractInterface = new Interface(WETH.abi);
    const weth = new ContractFactory(contractInterface, WETH.bytecode, wallet);
    const deployData = weth.getDeployTransaction();

    const deployTx = await wallet.signTransaction({ ...deployData, nonce: 0, gasLimit: 10000000, gasPrice: 875000000 });
    await provider.sendTransaction(deployTx)

    const address = utils.getContractAddress({ from: wallet.address, nonce: 0 });

    expect(await provider.getCode(address)).to.equal(WETH.deployedBytecode)
  })
});
