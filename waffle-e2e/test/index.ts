import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {waffleChai} from '@ethereum-waffle/chai';

import {MockProvider} from '@ethereum-waffle/provider';
import {ContractFactory} from 'ethers';
import HelloContract from '../build/HelloContract.json';

chai.use(chaiAsPromised);
chai.use(waffleChai);

it('deploys contract and emit simple event', async () => {
  const [wallet] = new MockProvider().getWallets();
  const factory = new ContractFactory(HelloContract.abi, HelloContract.bytecode, wallet);
  const contract = await factory.deploy();
  await expect(contract.sayHello()).to.emit(contract, 'LogHello');
});
