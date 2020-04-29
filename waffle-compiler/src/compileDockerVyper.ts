import {Config} from './config';
import {execSync} from 'child_process';
import {ImportFile} from '@resolver-engine/imports';
import {solcOutputMaxBuffer} from './compiler';
import {getCompilerInput} from './compilerInput';

const CONTAINER_PATH = '/project';

export function compileDockerVyper(config: Config) {
  return async function compile(sources: ImportFile[]) {
    console.log('Warring! This is experimental and the api might change without major version change.');
    const command = createBuildCommand(config);
    const input = getCompilerInput(sources, config.compilerOptions, 'Vyper');
    return JSON.parse(execSync(command, {input, maxBuffer: solcOutputMaxBuffer}).toString());
  };
}

export function createBuildCommand(config: Config) {
  const configTag = config.compilerVersion;
  const tag = configTag ? `:${configTag}` : ':stable';
  return `docker run ${getVolumes(config)} -i -a stdin -a stdout ` +
    `-w ${CONTAINER_PATH} --entrypoint vyper-json vyperlang/vyper${tag}`;
}

export function getVolumes(config: Config) {
  const hostPath = process.cwd();
  return `-v ${hostPath}:${CONTAINER_PATH}`;
}
