import {Config} from './config';
import {execSync} from 'child_process';
import {ImportFile} from '@resolver-engine/imports';
import {solcOutputMaxBuffer} from './compiler';
import {buildInputObject} from './buildUitls';
import {experimentalWarring} from './utils';

const CONTAINER_PATH = '/project';

export function compileDockerVyper(config: Config) {
  return async function compile(sources: ImportFile[]) {
    experimentalWarring();
    const command = createBuildCommand(config);
    const input = JSON.stringify(buildInputObject(sources, config.compilerOptions, 'Vyper'), null, 2);
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
