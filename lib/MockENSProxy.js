import {utils, Contract} from 'ethers';
import MockENS from '../build/MockENS';

class MockENSProxy {
  constructor(provider, wallet) {
    this.ens = new Contract(provider.ensAddress, MockENS.interface, wallet);
  }

  async setAddr(name, value) {
    const nameHash = utils.namehash(name);
    return this.ens.setAddr(nameHash, value);
  }
}

export default MockENSProxy;
