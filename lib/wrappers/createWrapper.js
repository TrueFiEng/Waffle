import SolcjsWrapper from './solcjsWrapper';
import NativeWrapper from './nativeWrapper';
import DockerWrapper from './dockerWrapper';

export default function createWrapper(config) {
  if (config.compiler === 'solc') {
    return new NativeWrapper(config);
  } else if (config.compiler === 'dockerized-solc') {
    return new DockerWrapper(config);
  }
  return new SolcjsWrapper(config);
}
