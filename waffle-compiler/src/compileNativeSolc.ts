import {resolve} from 'path';
import {execSync} from 'child_process';
import {Config} from './config';
import {getCompilerInput} from './compilerInput';
import {ImportFile} from '@resolver-engine/imports';
import {solcOutputMaxBuffer} from './compiler';

export function compileNativeSolc(config: Config) {
  return async function compile(sources: ImportFile[]) {
    const command = createBuildCommand(config);
    const input = getCompilerInput(sources, config.compilerOptions, 'Solidity');
    return JSON.parse(execSync(command, {input, maxBuffer: solcOutputMaxBuffer}).toString());
  };
}

export function createBuildCommand(config: Config) {
  const command = 'solc';
  const params = '--standard-json';
  const customAllowedPaths = config.compilerAllowedPaths
    .map((path: string) => resolve(path));
  const allowedPaths = [
    resolve(config.sourceDirectory),
    resolve(config.nodeModulesDirectory),
    ...customAllowedPaths
  ];
  return `${command} ${params} --allow-paths ${allowedPaths.join(',')}`;
}
