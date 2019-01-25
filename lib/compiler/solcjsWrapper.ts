import solc, { SolcCompiler } from 'solc';
import {promisify} from 'util';
import {readFileContent} from '../utils';
import BaseWrapper, {ContractJson} from './baseWrapper';

const loadRemoteVersion = promisify(solc.loadRemoteVersion);

class SolcjsWrapper extends BaseWrapper {
  protected solc: SolcCompiler;

  public async findInputs(files: string[]) {
    return Object.assign({}, ...files.map((file) => ({[file]: readFileContent(file)})));
  }

  protected convertSources(sources: Record<string, any>) {
    const convertedSources: Record<string, { content: string }> = {};
    Object.keys(sources).map((key) => convertedSources[key.replace(/\\/g, '/')] = {content: sources[key]});
    return convertedSources;
  }

  protected async loadCompiler() {
    if (this.solc) {
      return;
    } else if (this.config.solcVersion) {
      this.solc = await loadRemoteVersion(this.config.solcVersion);
    } else {
      this.solc = solc;
    }
  }

  public async compile(sourcesFiles: string[], findImports: (...args: any) => any) {
    await this.loadCompiler();
    const sources = await this.findInputs(sourcesFiles);
    const input = {
      language: 'Solidity',
      sources: this.convertSources(sources),
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']
          }
        }
      }
    };
    const output = this.solc.compile(JSON.stringify(input), findImports);
    return JSON.parse(output);
  }

  protected getContent(contractJson: ContractJson) {
    contractJson.interface = contractJson.abi;
    contractJson.bytecode = contractJson.evm.bytecode.object;
    return JSON.stringify(contractJson, null, 2);
  }
}

export default SolcjsWrapper;
