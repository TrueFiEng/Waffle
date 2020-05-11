<<<<<<< HEAD
import chai, {expect} from 'chai';
import {waffleChai} from '@ethereum-waffle/chai';

import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import HelloContract from '../build/HelloContract.json';

chai.use(waffleChai);

it('deploys contract and emit simple event', async () => {
  const [wallet] = new MockProvider().getWallets();
  const factory = new ContractFactory(HelloContract.abi, HelloContract.bytecode, wallet);
  const contract = await factory.deploy();
  await expect(contract.sayHello()).to.emit(contract, 'LogHello');
});
=======
import chai, {expect} from 'chai';
import {waffleChai} from '@ethereum-waffle/chai';

import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import HelloContract from '../build/HelloContract.json';

chai.use(waffleChai);

it('deploys contract and emit simple event', async () => {
  const [wallet] = new MockProvider().getWallets();
  const factory = new ContractFactory(HelloContract.abi, HelloContract.bytecode, wallet);
  const contract = await factory.deploy();
  await expect(contract.sayHello()).to.emit(contract, 'LogHello');
});
>>>>>>> 6509df661491f79f4648caa0f8110e5a9e5a13e3
