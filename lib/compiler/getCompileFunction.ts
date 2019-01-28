import { Config } from '../config/config';
import {compileSolcjs} from './compileSolcjs';
import {compileNative} from './compileNative';
import {compileDocker} from './compileDocker';

export type CompileFunction = (
  sources: string[],
  findImports: (file: string) => any
) => any;

export function getCompileFunction(config: Config): CompileFunction {
  if (config.compiler === 'native') {
    return compileNative(config);
  } else if (config.compiler === 'dockerized-solc') {
    return compileDocker(config);
  } else if (config.compiler === 'solcjs' || !config.compiler) {
    return compileSolcjs(config);
  }
  throw new Error(`Unknown compiler ${config.compiler}`);
}
