import {expect} from 'chai';
import {MockProvider} from '../src/MockProvider';
import {deployLogger} from './LoggerContract';

describe('MockProvider.logs', () => {
  it('can be cleared', async () => {
    const provider = new MockProvider();
    const [deployer] = provider.getWallets();

    const contract = await deployLogger(deployer, 'Hello');
    await contract.up({gasLimit: 1000000});
    await contract.down({gasLimit: 1000000});
    await contract.get();
    await expect(contract.down({gasLimit: 1000000})).to.be.rejected;
  });
});
