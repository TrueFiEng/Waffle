import {Web3Provider} from 'ethers/providers';
import {SourceMapLoader} from './SourceMapLoader';

export class RevertLocalizer {
  private _buildDir?: string = './build';

  set buildDir(value: string) {
    this._buildDir = value;
  }

  interceptCalls(provider: Web3Provider) {
    type SendAsync = (request: any, callback: (error: any, response: any) => void) => void
    const interceptSendAsync = (sendAsync: SendAsync): SendAsync =>
      (request, cb) => sendAsync(request, async (error, response) => {
        try {
          await this._preprocessCallResult(provider, request, error);
        } catch (e) {
          console.error('e: ', e);
        }
        cb(error, response);
      });
    provider['_sendAsync'] = interceptSendAsync(provider['_sendAsync']);
  }

  private async _preprocessCallResult(provider: Web3Provider, request: any, error: any) {
    if (this._buildDir && isValidEthEstimateGasRevert(request, error)) {
      const {programCounter} = getRevertDetails(error);
      const contractCode = await provider.getCode(request.params[0].to);
      const sourceMap = await new SourceMapLoader(this._buildDir)
        .locateLineByBytecodeAndProgramCounter(contractCode, programCounter);

      if (!sourceMap) {
        return null;
      }

      error.message += ` (this revert occurred at ${sourceMap.file}:${sourceMap.line})`;
    }
  }
}

function getRevertDetails(error: any) {
  const result = error.results[Object.keys(error.results)[0]];
  return {
    reason: result.reason,
    programCounter: result.program_counter
  };
}

function isValidEthEstimateGasRevert(request: any, error: any): boolean {
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
}
