import {Config} from './config';
import {compileSolcjs} from './compileSolcjs';
import {compileNativeSolc} from './compileNativeSolc';
import {compileDockerSolc} from './compileDockerSolc';
import {compileDockerVyper} from './compileDockerVyper';
import {ImportFile} from '@resolver-engine/imports';

export type CompileFunction = (
  sources: ImportFile[],
  findImports: (file: string) => any
) => any;

export function getCompileFunction(config: Config): CompileFunction {
  if (config.compilerType === 'native') {
    return compileNativeSolc(config);
  } else if (config.compilerType === 'dockerized-solc') {
    return compileDockerSolc(config);
  } else if (config.compilerType === 'solcjs') {
    return compileSolcjs(config);
  } else if (config.compilerType === 'dockerized-vyper') {
    return compileDockerVyper(config);
  }
  throw new Error(`Unknown compiler ${config.compilerType}`);
}
