import { Config } from '../config/config';
import SolcjsWrapper from './solcjsWrapper';
import NativeWrapper from './nativeWrapper';
import DockerWrapper from './dockerWrapper';

export interface Wrapper {
  compile(sourceFiles: string[], findImports: () => any): Promise<any>;
  saveOutput(output: any, targetPath: string): Promise<void>;
}

export function createWrapper(config: Config): Wrapper {
  if (config.compiler === 'native') {
    return new NativeWrapper(config);
  } else if (config.compiler === 'dockerized-solc') {
    return new DockerWrapper(config);
  } else if (config.compiler === 'solcjs' || !config.compiler) {
    return new SolcjsWrapper(config);
  }
  throw new Error(`Unknown compiler ${config.compiler}`);
}
