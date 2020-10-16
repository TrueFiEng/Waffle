import {providers, utils} from 'ethers';
import {BuidlerNode} from '@nomiclabs/buidler/internal/buidler-evm/provider/node';
import {Mutex} from '@nomiclabs/buidler/internal/buidler-evm/vendor/await-semaphore';
import {RequestableBuidlerProvider} from './MockProvider';

export interface RecordedCall {
  readonly address: string | undefined;
  readonly data: string;
}

export class CallHistory {
  private recordedCalls: RecordedCall[] = []
  private readonly _mutex = new Mutex();

  clear() {
    this.recordedCalls = [];
  }

  getCalls() {
    return this.recordedCalls;
  }

  record(provider: providers.Web3Provider) {
    const hardhatProvider = provider.provider as any as RequestableBuidlerProvider;
    this._record(hardhatProvider);
  }

  private _record(provider: RequestableBuidlerProvider) {
    const originalRequest = provider.request.bind(provider);
    provider.request = async (args) => {
      const release = await this._mutex.acquire();
      try {
        if (!isInitialised(provider)) {
          const node = await initialise(provider);
          await addVmListener(node, 'beforeMessage', (message) => {
            this.recordedCalls.push(toRecordedCall(message));
          });
        }
        return originalRequest(args);
      } finally {
        release();
      }
    };
  }
}

function isInitialised(provider: RequestableBuidlerProvider): boolean {
  return provider['_node'] !== undefined;
}

async function initialise(provider: RequestableBuidlerProvider): Promise<BuidlerNode> {
  await provider['_init']();
  return provider['_node'];
}

async function addVmListener(
  node: BuidlerNode,
  event: string,
  handler: (value: any) => void
) {
  node['_vm'].on(event, handler);
}

function toRecordedCall(message: any): RecordedCall {
  return {
    address: message.to ? utils.getAddress(utils.hexlify(message.to)) : undefined,
    data: message.data ? utils.hexlify(message.data) : '0x'
  };
}
