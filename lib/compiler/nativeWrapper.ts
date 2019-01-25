import {join, resolve} from 'path';
import ImportMappingBuilder from './importMappingBuilder';
import BaseWrapper from './baseWrapper';
import { Config } from '../config/config';

export default class NativeWrapper extends BaseWrapper {
  constructor(config: Config) {
    super(config);
    const {sourcesPath, npmPath} = this.config;
    this.mappingBuilder = new ImportMappingBuilder(sourcesPath, npmPath);
  }

  public getAbsolutePath(relativePath: string) {
    return join(process.cwd(), relativePath);
  }

  public buildCommand() {
    const command = 'solc';
    const params = '--standard-json';
    const customAllowedPaths = (this.config.allowedPaths || []).map( (path) => resolve(path));
    const allowedPaths = [resolve(this.config.sourcesPath), resolve(this.config.npmPath), ...customAllowedPaths];
    return `${command} ${params} --allow-paths ${allowedPaths.join(',')}`;
  }
}
