import {join} from 'path';
import ImportMappingBuilder from './importMappingBuilder';
import {Config} from '../config/config';
import {execSync} from 'child_process';
import {buildInputObject, buildSources} from './buildUitls';

const CONTAINER_PATH = '/home/project';
const NPM_PATH = '/home/npm';

export function compileDocker(config: Config) {
  return async function compile(sources: string[]) {
    const command = createBuildCommand(config);
    const input = JSON.stringify(buildInputJson(sources, config), null, 2);
    return JSON.parse(execSync(command, {input}).toString());
  };
}

export function createBuildCommand(config: Config) {
  const configTag = config['docker-tag'];
  const tag = configTag ? `:${configTag}` : ':stable';
  const allowedPaths = `"${CONTAINER_PATH},${NPM_PATH}"`;
  return `docker run ${getVolumes(config)} -i -a stdin -a stdout ` +
    `ethereum/solc${tag} solc --standard-json --allow-paths ${allowedPaths}`;
}

export function getVolumes(config: Config) {
  const hostPath = process.cwd();
  const hostNpmPath = join(hostPath, config.npmPath);
  return `-v ${hostPath}:${CONTAINER_PATH} -v ${hostNpmPath}:${NPM_PATH}`;
}

export function buildInputJson(sources: string[], config: Config) {
  return buildInputObject(
    buildSources(sources, input => join(CONTAINER_PATH, input)),
    getMappings(sources, config),
  );
}

function getMappings(sources: string[], config: Config) {
  const mappingBuilder = new ImportMappingBuilder(
    config.sourcesPath,
    config.npmPath,
    CONTAINER_PATH,
    NPM_PATH
  );
  return mappingBuilder.getMappings(sources);
}
