import {execSync} from 'child_process';
import fs from 'fs';
import {join, dirname} from 'path';

export default class BaseWrapper {
  constructor(config) {
    this.config = config;
  }

  getContent(contractJson) {
    contractJson.metadata = JSON.parse(contractJson.metadata);
    contractJson.abi = contractJson.metadata.output.abi;
    return JSON.stringify(contractJson, null, 2);
  }

  buildSources(inputs) {
    const sources = {};
    for (const input of inputs) {
      sources[input] = {urls: [this.getAbsolutePath(input)]};
    }
    return sources;
  }

  async saveOutput(output, targetPath, filesystem = fs) {
    for (const [,file] of Object.entries(output.contracts)) {
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

  buildInputJson(sources) {
    return {
      language: 'Solidity',
      sources: this.buildSources(sources),
      settings: {
        remappings: this.getMappings(sources),
        outputSelection: {'*': {'*': ['metadata', 'evm.bytecode']}}
      }
    };
  }

  getMappings(sources) {
    const mappings = this.mappingBuilder.getMappings(sources);
    return Object.entries(mappings).map(([key, value]) => `${key}=${value}`);
  }

  compile(sources) {
    const command = this.buildCommand(sources);
    const input = JSON.stringify(this.buildInputJson(sources), null, 2);
    return JSON.parse(execSync(command, {input}));
  }
}
