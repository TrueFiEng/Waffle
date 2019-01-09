import {join} from 'path';
import ImportMappingBuilder from './importMappingBuilder';
import BaseWrapper from './baseWrapper';

export default class DockerWrapper extends BaseWrapper {
  constructor(config) {
    super(config);
    this.containerPath = '/home/project';
    this.containerNpmPath = '/home/npm';
    const {sourcesPath, npmPath} = this.config;
    this.mappingBuilder = new ImportMappingBuilder(sourcesPath, npmPath, this.containerPath, this.containerNpmPath);
  }

  getAbsolutePath(relativePath) {
    return join(this.containerPath, relativePath);
  }

  getVolumes() {
    const hostPath = process.cwd();
    const hostNpmPath = join(hostPath, this.config.npmPath);
    return `-v ${hostPath}:${this.containerPath} -v ${hostNpmPath}:${this.containerNpmPath}`;
  }

  buildCommand() {
    const configTag = this.config['docker-tag'];
    const tag = configTag ? `:${configTag}` : ':stable';
    const allowedPaths = `"${this.containerPath},${this.containerNpmPath}"`;
    return `docker run ${this.getVolumes()} -i -a stdin -a stdout ethereum/solc${tag} solc --standard-json --allow-paths ${allowedPaths}`;
  }
}
