import {Config} from './config';
import {ImportFile} from '@resolver-engine/imports';
import {getCompilerInput} from './compilerInput';
import {executeCommand} from './executeCommand';

const CONTAINER_PATH = '/project';

export function compileDockerVyper(config: Config) {
  return async function compile(sources: ImportFile[]) {
    const command = createBuildCommand(config);
    const input = getCompilerInput(sources, config.compilerOptions, 'Vyper');
    const output = await executeCommand(command, input);
    return JSON.parse(output);
  };
}

export function createBuildCommand(config: Config) {
  const tag = config.compilerVersion || 'stable';
  const volumes = `-v ${process.cwd()}:${CONTAINER_PATH}`;
  return `docker run ${volumes} -i -a stdin -a stdout ` +
    `-w ${CONTAINER_PATH} --entrypoint vyper-json vyperlang/vyper:${tag}`;
}
