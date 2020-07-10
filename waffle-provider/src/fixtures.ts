import {providers, Signer} from 'ethers';
import {MockProvider} from './MockProvider';

type Fixture<T> = (signers: Signer[], provider: MockProvider) => Promise<T>;
interface Snapshot<T> {
  fixture: Fixture<T>;
  data: T;
  id: string;
  provider: providers.Web3Provider;
  signers: Signer[];
}

export const loadFixture = createFixtureLoader();

export function createFixtureLoader(overrideSigners?: Signer[], overrideProvider?: MockProvider) {
  const snapshots: Snapshot<any>[] = [];

  return async function load<T>(fixture: Fixture<T>): Promise<T> {
    const snapshot = snapshots.find((snapshot) => snapshot.fixture === fixture);
    if (snapshot) {
      await snapshot.provider.send('evm_revert', [snapshot.id]);
      snapshot.id = await snapshot.provider.send('evm_snapshot', []);
      return snapshot.data;
    } else {
      const provider = overrideProvider ?? new MockProvider();
      const signers = overrideSigners ?? provider.getWallets();

      const data = await fixture(signers, provider);
      const id = await provider.send('evm_snapshot', []);

      snapshots.push({fixture, data, id, provider, signers});
      return data;
    }
  };
}
