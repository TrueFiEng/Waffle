import { Config } from '../config/config';
import {compileSolcjs} from './compileSolcjs';
import NativeWrapper from './nativeWrapper';
import {compileDocker} from './compileDocker';

export interface Wrapper {
  compile(sourceFiles: string[], findImports: (file: string) => any): Promise<any>;
}

export function createWrapper(config: Config): Wrapper {
  if (config.compiler === 'native') {
    return new NativeWrapper(config);
  } else if (config.compiler === 'dockerized-solc') {
    return { compile: compileDocker(config) };
  } else if (config.compiler === 'solcjs' || !config.compiler) {
    return { compile: compileSolcjs(config) };
  }
  throw new Error(`Unknown compiler ${config.compiler}`);
}
