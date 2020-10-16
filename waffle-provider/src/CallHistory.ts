import {providers, utils} from 'ethers';
import {HardhatNetworkProvider} from '@nomiclabs/buidler/internal/hardhat-network/provider/provider';
import {HardhatNode} from '@nomiclabs/buidler/internal/hardhat-network/provider/node';

export interface RecordedCall {
  readonly address: string | undefined;
  readonly data: string;
}

export class CallHistory {
  private recordedCalls: RecordedCall[] = []

  clear() {
    this.recordedCalls = [];
  }

  getCalls() {
    return this.recordedCalls;
  }

  record(provider: providers.Web3Provider) {
    const hardhatProvider = provider.provider as HardhatNetworkProvider;
    this._record(hardhatProvider);
  }

  private _record(provider: HardhatNetworkProvider) {
    const originalRequest = provider.request.bind(provider);
    provider.request = async (args) => {
      if (!isInitialised(provider)) {
        const node = await initialise(provider);
        await addVmListener(node, 'beforeMessage', (message) => {
          this.recordedCalls.push(toRecordedCall(message));
        });
      }
      return originalRequest(args);
    };
  }
}

function isInitialised(provider: HardhatNetworkProvider): boolean {
  return provider['_node'] !== undefined;
}

async function initialise(provider: HardhatNetworkProvider): Promise<HardhatNode> {
  await provider['_init']();
  return provider['_node'];
}

async function addVmListener(
  node: HardhatNode,
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
