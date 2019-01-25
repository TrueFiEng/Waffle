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
    return createBuildCommand(this.config);
  }
}

export function createBuildCommand(config: Config) {
  const command = 'solc';
  const params = '--standard-json';
  const customAllowedPaths = (config.allowedPaths || []).map((path: string) => resolve(path));
  const allowedPaths = [resolve(config.sourcesPath), resolve(config.npmPath), ...customAllowedPaths];
  return `${command} ${params} --allow-paths ${allowedPaths.join(',')}`;
}
