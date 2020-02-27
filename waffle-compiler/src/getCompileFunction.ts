import {Config} from './config';
import {compileSolcjs} from './compileSolcjs';
import {compileNative} from './compileNative';
import {compileDocker} from './compileDocker';
import {ImportFile} from '@resolver-engine/imports';

export type CompileFunction = (
  sources: ImportFile[],
  findImports: (file: string) => any
) => any;

export function getCompileFunction(config: Config): CompileFunction {
  if (config.compilerType === 'native') {
    return compileNative(config);
  } else if (config.compilerType === 'dockerized-solc') {
    return compileDocker(config);
  } else if (config.compilerType === 'solcjs') {
    return compileSolcjs(config);
  }
  throw new Error(`Unknown compiler ${config.compilerType}`);
}
