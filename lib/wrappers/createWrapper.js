import SolcjsWrapper from './solcjsWrapper';
import SolcWrapper from './solcWrapper';
import DockerWrapper from './dockerWrapper';

export default function createWrapper(config) {
  if (config.compiler === 'solc') {
    return new SolcWrapper(config);
  } else if (config.compiler === 'dockerized-solc') {
    return new DockerWrapper(config);
  }
  return new SolcjsWrapper(config);
}
