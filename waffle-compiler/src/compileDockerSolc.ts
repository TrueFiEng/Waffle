import {join} from 'path';
import {Config} from './config';
import {getCompilerInput} from './compilerInput';
import {ImportFile} from '@resolver-engine/imports';
import {executeCommand} from './executeCommand';

const CONTAINER_PATH = '/home/project';
const NPM_PATH = '/home/npm';

export function compileDockerSolc(config: Config) {
  return async function compile(sources: ImportFile[]) {
    const command = createBuildCommand(config);
    const input = getCompilerInput(sources, config.compilerOptions, 'Solidity');
    const output = await executeCommand(command, input);
    return JSON.parse(output);
  };
}

export function createBuildCommand(config: Config) {
  const tag = config.compilerVersion || 'stable';
  const allowedPaths = `"${CONTAINER_PATH},${NPM_PATH}"`;
  return `docker run ${getVolumes(config)} -i -a stdin -a stdout ` +
    `ethereum/solc:${tag} --standard-json --allow-paths ${allowedPaths}`;
}

export function getVolumes(config: Config) {
  const hostPath = process.cwd();
  const hostNpmPath = join(hostPath, config.nodeModulesDirectory);
  return `-v ${hostPath}:${CONTAINER_PATH} -v ${hostNpmPath}:${NPM_PATH}`;
}
