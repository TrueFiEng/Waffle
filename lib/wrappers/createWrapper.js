import SolcjsWrapper from './solcjsWrapper';
import SolcWrapper from './solcWrapper';

export default function createWrapper(config) {
  if (config.compiler === 'solc') {
    return new SolcWrapper(config);
  }
  return new SolcjsWrapper();
}
