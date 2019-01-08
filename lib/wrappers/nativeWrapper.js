import {join, resolve} from 'path';
import ImportMappingBuilder from './importMappingBuilder';
import BaseWrapper from './baseWrapper';

export default class NativeWrapper extends BaseWrapper {
  constructor(config) {
    super(config);
    const {sourcesPath, npmPath} = this.config;
    this.mappingBuilder = new ImportMappingBuilder(sourcesPath, npmPath);
  }

  getAbsolutePath(relativePath) {
    return join(process.cwd(), relativePath);
  }

  buildCommand() {
    const command = 'solc';
    const params = '--standard-json';
    const allowedPaths = `${resolve(this.config.sourcesPath)},${resolve(this.config.npmPath)}`;
    return `${command} ${params} --allow-paths ${allowedPaths}`;
  }
}
