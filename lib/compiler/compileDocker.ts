import {join} from 'path';
import ImportMappingBuilder from './importMappingBuilder';
import {Config} from '../config/config';
import {execSync} from 'child_process';

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
  return {
    language: 'Solidity',
    sources: buildSources(sources),
    settings: {
      remappings: getMappings(sources, config),
      outputSelection: {'*': {'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']}}
    }
  };
}

function buildSources(inputs: string[]) {
  const sources: Record<string, { urls: string[] }> = {};
  for (const input of inputs) {
    sources[input.replace(/\\/g, '/')] = {urls: [getAbsolutePath(input)]};
  }
  return sources;
}

function getAbsolutePath(relativePath: string) {
  return join(CONTAINER_PATH, relativePath);
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
