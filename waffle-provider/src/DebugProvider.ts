import {providers} from 'ethers';
import {SourceMapLoader} from './SourceMapLoader';

export class DebugProvider implements providers.AsyncSendable {
  private _buildDir?: string = undefined;

  constructor(private readonly upstream: providers.AsyncSendable) {
  }

  set buildDir(value: string) {
    this._buildDir = value;
  }

  get isMetaMask() {
    return this.upstream.isMetaMask;
  }

  get host() {
    return this.upstream.host;
  }

  get path() {
    return this.upstream.path;
  }

  get sendAsync() {
    if (typeof this.upstream.sendAsync !== 'function') {
      return undefined;
    }
    return (request: any, cb: (error: any, response: any) => void) => {
      if (this.upstream.sendAsync) {
        this.upstream.sendAsync(
          request,
          async (error, response) => cb(...await this.rpcMiddleware(request, error, response))
        );
      }
    };
  }

  get send() {
    if (typeof this.upstream.send !== 'function') {
      return undefined;
    }
    return (request: any, cb: (error: any, response: any) => void) => {
      if (this.upstream.send) {
        this.upstream.send(
          request,
          async (error, response) => cb(...await this.rpcMiddleware(request, error, response))
        );
      }
    };
  }

  private async rpcMiddleware(request: any, error: any, response: any): Promise<[any, any]> {
    if (!this._buildDir) {
      return [error, response];
    }
    if (DebugProvider.isValidEthEstimateGasRevert(request, error)) {
      const {programCounter} = getRevertDetails(error);
      const contractAddress = request.params[0].to;
      const contractCode = await this.getContractCode(contractAddress);
      const {file, line} = await new SourceMapLoader(this._buildDir)
        .locateLineByBytecodeAndProgramCounter(contractCode, programCounter);

      error.message += ` (this revert occurred at ${file}:${line})`;
    }
    return [error, response];
  }

  private async getContractCode(address: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.upstreamSend(
        {method: 'eth_getCode', params: [address, 'latest']},
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.result);
          }
        }
      );
    });
  }

  private async upstreamSend(request: any, cb: (error: any, response: any) => void) {
    if (this.upstream.sendAsync) {
      this.upstream.sendAsync(request, cb);
    }
    if (this.upstream.send) {
      this.upstream.send(request, cb);
    }
  }

  private static isValidEthEstimateGasRevert(request: any, error: any): boolean {
    if (
      request.method === 'eth_estimateGas' &&
      error &&
      error.message.startsWith('VM Exception while processing transaction: revert') &&
      typeof error.results === 'object' &&
      error.results !== null &&
      Object.keys(error.results).length > 0
    ) {
      const result = error.results[Object.keys(error.results)[0]];
      return result.error === 'revert';
    }
    return false;
  };
}

const getRevertDetails = (error: any) => {
  const result = error.results[Object.keys(error.results)[0]];
  return {
    reason: result.reason,
    programCounter: result.program_counter
  };
};
