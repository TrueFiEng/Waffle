import {execSync} from 'child_process';
import fs from 'fs';
import {join, dirname} from 'path';
import {Config} from '../config/config';
import ImportMappingBuilder from './importMappingBuilder';

export interface BytecodeJson {
  linkReferences: object;
  object: string;
  opcodes: string;
  sourceMap: string;
}

export interface EvmJson {
  bytecode: BytecodeJson;
}

export interface ContractJson {
  interface: object[];
  abi: object[];
  bytecode: string;
  evm: EvmJson;
}

export default class BaseWrapper {
  protected config: Config;
  protected mappingBuilder: ImportMappingBuilder;

  constructor(config: Config) {
    this.config = config;
  }

  protected getContent(contractJson: ContractJson) {
    if (this.config.legacyOutput) {
      contractJson.interface = contractJson.abi;
      contractJson.bytecode = contractJson.evm.bytecode.object;
    }
    return JSON.stringify(contractJson, null, 2);
  }

  protected getAbsolutePath(input: string) {
    return '';
  }

  protected buildSources(inputs: string[]) {
    const sources: Record<string, { urls: string[] }> = {};
    for (const input of inputs) {
      sources[input] = {urls: [this.getAbsolutePath(input)]};
    }
    return sources;
  }

  public async saveOutput(output: any, targetPath: string, filesystem = fs) {
    for (const [, file] of Object.entries(output.contracts)) {
      for (const [contractName, contractJson] of Object.entries(file)) {
        const filePath = join(targetPath, `${contractName}.json`);
        const dirPath = dirname(filePath);
        if (!filesystem.existsSync(dirPath)) {
          filesystem.mkdirSync(dirPath);
        }
        filesystem.writeFileSync(filePath, this.getContent(contractJson));
      }
    }
  }

  public buildInputJson(sources: string[]) {
    return {
      language: 'Solidity',
      sources: this.buildSources(sources),
      settings: {
        remappings: this.getMappings(sources),
        outputSelection: {'*': {'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']}}
      }
    };
  }

  protected getMappings(sources: string[]) {
    const mappings = this.mappingBuilder.getMappings(sources);
    return Object.entries(mappings).map(([key, value]) => `${key}=${value}`);
  }

  protected buildCommand(sources: string[]) {
    return '';
  }

  public compile(sources: string[], findImports?: any) {
    const command = this.buildCommand(sources);
    const input = JSON.stringify(this.buildInputJson(sources), null, 2);
    return JSON.parse(execSync(command, {input}).toString());
  }
}
