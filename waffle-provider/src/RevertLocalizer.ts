import {providers} from 'ethers';
import {SourceMapLoader} from './SourceMapLoader';
import {GanacheWrapper} from './GanacheWrapper';

export class RevertLocalizer {
  private _buildDir?: string = './build';

  constructor(private provider: providers.Provider) {}

  set buildDir(value: string) {
    this._buildDir = value;
  }

  interceptCalls(wrapper: GanacheWrapper) {
    wrapper.preprocessCallback = async (request: any, error: any) => {
      try {
        await this._preprocessCallResult(request, error);
      } catch (e) {
        // Silent fail. Log errors here to debug
      }
    };
  }

  private async _preprocessCallResult(request: any, error: any) {
    if (this._buildDir && isValidEthEstimateGasRevert(request, error)) {
      const {programCounter} = getRevertDetails(error);
      const contractCode = await this.provider.getCode(request.params[0].to);
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
