import fs from 'fs';
import path from 'path';
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

  public async saveOutput(output: any, targetPath: string) {
    for (const key of Object.keys(output.contracts)) {
      for (const contract of Object.keys(output.contracts[key])) {
        const filePath = path.join(targetPath, `${contract}.json`);
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
        const content = this.getContent(output.contracts[key][contract]);
        try {
          fs.writeFileSync(filePath, content);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}

export default SolcjsWrapper;
