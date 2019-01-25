import {execSync} from 'child_process';
import {Config} from '../config/config';
import ImportMappingBuilder from './importMappingBuilder';

export default class BaseWrapper {
  protected config: Config;
  protected mappingBuilder: ImportMappingBuilder;

  constructor(config: Config) {
    this.config = config;
  }

  protected getAbsolutePath(input: string) {
    return '';
  }

  protected buildSources(inputs: string[]) {
    const sources: Record<string, { urls: string[] }> = {};
    for (const input of inputs) {
      sources[input.replace(/\\/g, '/')] = {urls: [this.getAbsolutePath(input)]};
    }
    return sources;
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
