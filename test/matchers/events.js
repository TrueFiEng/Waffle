import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, deployContract, getWallets} from '../../lib/waffle';
import Events from './build/Events';
import solidity from '../../lib/matchers';

chai.use(solidity);
chai.use(chaiAsPromised);

const {expect} = chai;

describe('Events', () => {
  let provider;
  let events;
  let wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    events = await deployContract(wallet, Events);  
  });

  it('Emit one: success', async () => {
    await expect(events.emitOne()).to.emit(events, 'One');
  });

  it('Emit one: fail', async () => {          
    await expect(
      expect(events.emitOne()).to.emit(events, 'Two')
    ).to.be.eventually.rejected;
  });

  it('Emit two: success', async () => {          
    await expect(events.emitTwo()).to.emit(events, 'Two');
  });

  it('Emit two: fail', async () => {          
    await expect(
      expect(events.emitTwo()).to.emit(events, 'One')
    ).to.be.eventually.rejected;    
  });

  it('Emit both: success', async () => {          
    await expect(events.emitBoth()).to.emit(events, 'One');
    await expect(events.emitBoth()).to.emit(events, 'Two');
  });
});
