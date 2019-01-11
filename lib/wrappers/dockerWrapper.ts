import {join} from 'path';
import ImportMappingBuilder from './importMappingBuilder';
import BaseWrapper from './baseWrapper';
import { Config } from '../config/config';

export default class DockerWrapper extends BaseWrapper {
  private containerPath: string;
  private containerNpmPath: string;
  constructor(config: Config) {
    super(config);
    this.containerPath = '/home/project';
    this.containerNpmPath = '/home/npm';
    const {sourcesPath, npmPath} = this.config;
    this.mappingBuilder = new ImportMappingBuilder(sourcesPath, npmPath, this.containerPath, this.containerNpmPath);
  }

  protected getAbsolutePath(relativePath: string) {
    return join(this.containerPath, relativePath);
  }

  public getVolumes() {
    const hostPath = process.cwd();
    const hostNpmPath = join(hostPath, this.config.npmPath);
    return `-v ${hostPath}:${this.containerPath} -v ${hostNpmPath}:${this.containerNpmPath}`;
  }

  public buildCommand() {
    const configTag = this.config['docker-tag'];
    const tag = configTag ? `:${configTag}` : ':stable';
    const allowedPaths = `"${this.containerPath},${this.containerNpmPath}"`;
    return `docker run ${this.getVolumes()} -i -a stdin -a stdout ` +
      `ethereum/solc${tag} solc --standard-json --allow-paths ${allowedPaths}`;
  }
}
