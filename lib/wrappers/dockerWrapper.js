import path from 'path';
import {execSync} from 'child_process';
import ImportMappingBuilder from './importMappingBuilder';
import fs from 'fs';

export default class DockerWrapper {
  constructor(config) {
    this.config = config;
    this.containerPath = '/home/project';
  }

  buildSources(inputs) {
    let sources = {};
    for (const input of inputs) {
      const basename = path.basename(input);
      const fullPath = `${this.containerPath}/${input}`;
      sources = {[basename]: {urls: [fullPath]}, ...sources};
    }
    return sources;
  }

  getMappings(sources) {
    const {sourcesPath, npmPath} = this.config;
    const builder = new ImportMappingBuilder(sourcesPath, npmPath, this.containerPath);
    const mappings = builder.getMappings(sources);
    return Object.entries(mappings).map(([key, value]) => `${key}=${value}`);
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

  buildCommand() {
    const hostPath = process.cwd();
    const containerPath = `/home/project`;
    return `docker run -v ${hostPath}:${containerPath} -i -a stdin -a stdout ethereum/solc:stable solc --standard-json --allow-paths ${containerPath}`;
  }

  async saveOutput(output, targetPath, filesystem = fs) {
    for (const [,file] of Object.entries(output.contracts)) {
      for (const [contractName, contractJson] of Object.entries(file)) {
        const filePath = path.join(targetPath, `${contractName}.json`);
        const dirPath = path.dirname(filePath);
        if (!filesystem.existsSync(dirPath)) {
          filesystem.mkdirSync(dirPath);
        }
        filesystem.writeFileSync(filePath, JSON.stringify(contractJson));
      }
    }
  }

  compile(sources) {
    const command = this.buildCommand();
    const input = JSON.stringify(this.buildInputJson(sources));
    return JSON.parse(execSync(command, {input}));
  }
}
