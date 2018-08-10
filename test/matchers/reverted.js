import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, deployContract, getWallets} from '../../lib/waffle';
import Matchers from './build/Matchers';
import solidity from '../../lib/matchers';

chai.use(solidity);
chai.use(chaiAsPromised);

const {expect} = chai;

const alwaysReject = new Promise((resolve, reject) => {
  reject('Random reason');
});

describe('Matchers: reverted', () => {
  let provider;
  let matchers;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    matchers = await deployContract(wallet, Matchers);  
  });

  it('Throw: success', async () => {
    await expect(matchers.doThrow()).to.be.reverted;
  });

  it('Not to revert: success', async () => {
    await expect(matchers.doNothing()).not.to.be.reverted;
  }); 

  it('Revert with modification: success', async () => {
    await expect(matchers.doRevertAndModify()).to.be.reverted;
  });

  it('ThrowAndModify: success', async () => {
    await expect(matchers.doThrowAndModify()).to.be.reverted;
  });

  it('Revert: success', async () => {
    await expect(matchers.doRevert()).to.be.reverted;
  });

  it('Revert: fail no exception', async () => {
    await expect(
      expect(matchers.doNothing()).to.be.reverted
    ).to.be.eventually.rejected;
  });

  it('Not to revert: fail', async () => {
    await expect(
      expect(matchers.doThrow()).not.to.be.reverted
    ).to.be.eventually.rejected;
  }); 

  it('Revert: fail, random exception', async () => {
    await expect(alwaysReject).not.to.be.reverted;
  });

  it('Not to revert: fail, random exception', async () => {
    await expect(
      expect(alwaysReject).to.be.reverted
    ).to.be.eventually.rejected;
  });
});
