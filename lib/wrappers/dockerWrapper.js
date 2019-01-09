import {join} from 'path';
import ImportMappingBuilder from './importMappingBuilder';
import BaseWrapper from './baseWrapper';

export default class DockerWrapper extends BaseWrapper {
  constructor(config) {
    super(config);
    this.containerPath = '/home/project';
    const {sourcesPath, npmPath} = this.config;
    this.mappingBuilder = new ImportMappingBuilder(sourcesPath, npmPath, this.containerPath);
  }

  getAbsolutePath(relativePath) {
    return join(this.containerPath, relativePath);
  }

  getVolumes() {
    const hostPath = process.cwd();
    return `${hostPath}:${this.containerPath}`;
  }

  buildCommand() {
    const configTag = this.config['docker-tag'];
    const tag = configTag ? `:${configTag}` : ':stable';
    const allowedPaths = `"${this.containerPath}"`;
    return `docker run -v ${this.getVolumes()} -i -a stdin -a stdout ethereum/solc${tag} solc --standard-json --allow-paths ${allowedPaths}`;
  }
}
