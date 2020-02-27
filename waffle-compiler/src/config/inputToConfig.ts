import {Config, InputConfig} from './config';
import {defaultConfig} from './defaultConfig';
import {deprecate} from '../deprecate';

export function inputToConfig(input: InputConfig) {
  const result: any = {...defaultConfig};
  function set(key: string, value: any) {
    result[key] = value;
  }

  for (const key in input) {
    if ((input as any)[key] != null) {
      if (key in defaultConfig) {
        set(key, (input as any)[key]);
      } else if (key === 'sourcesPath') {
        deprecate('sourcesPath', 'Use sourceDirectory instead.');
        set('sourceDirectory', input[key]);
      } else if (key === 'targetPath') {
        deprecate('targetPath', 'Use outputDirectory instead.');
        set('outputDirectory', input[key]);
      } else if (key === 'npmPath') {
        deprecate('npmPath', 'Use nodeModulesDirectory instead.');
        set('nodeModulesDirectory', input[key]);
      } else if (key === 'compiler') {
        deprecate('compiler', 'Use compilerType instead.');
        set('compilerType', input[key]);
      } else if (key === 'docker-tag') {
        deprecate('docker-tag', 'Use compilerVersion instead.');
        set('compilerVersion', input[key]);
      } else if (key === 'solcVersion') {
        deprecate('solcVersion', 'Use compilerVersion instead.');
        set('compilerVersion', input[key]);
      } else if (key === 'allowedPaths') {
        deprecate('allowedPaths', 'Use compilerAllowedPaths instead.');
        set('compilerAllowedPaths', input[key]);
      } else if (key === 'legacyOutput') {
        deprecate('legacyOutput', 'It was always enabled anyway.');
      } else if (key === 'ganacheOptions') {
        deprecate('ganacheOptions', 'It has no effect on the compiler.');
      }
    }
  }

  validate(result);
  return result;
}

function validate(config: any): asserts config is Config {
  const success = (
    checkSourceDirectory(config.sourceDirectory) &&
    checkOutputDirectory(config.outputDirectory) &&
    checkNodeModulesDirectory(config.nodeModulesDirectory) &&
    checkCompilerType(config.compilerType) &&
    checkCompilerVersion(config.compilerVersion) &&
    checkCompilerAllowedPaths(config.compilerAllowedPaths) &&
    checkCompilerOptions(config.compilerOptions) &&
    checkOutputHumanReadableAbi(config.outputHumanReadableAbi) &&
    checkOutputMinimal(config.outputMinimal) &&
    checkOutputType(config.outputType)
  );
  if (!success) {
    throw new TypeError('Invalid config');
  }
}

const checkSourceDirectory = checkType('sourceDirectory', 'string');
const checkOutputDirectory = checkType('outputDirectory', 'string');
const checkNodeModulesDirectory = checkType('nodeModulesDirectory', 'string');
const checkCompilerType = checkEnum('compilerType', ['native', 'dockerized-solc', 'solcjs']);
const checkCompilerVersion = checkType('compilerVersion', 'string');

function checkCompilerAllowedPaths(compilerAllowedPaths: unknown) {
  if (!Array.isArray(compilerAllowedPaths)) {
    console.warn('compilerAllowedPaths must be string[], but is not an array');
    return false;
  } else if (compilerAllowedPaths.some(x => typeof x !== 'string')) {
    console.warn('compilerAllowedPaths must be string[], but some of the values are not strings');
    return false;
  }
  return true;
}

const checkCompilerOptions = checkType('compilerOptions', 'object');
const checkOutputHumanReadableAbi = checkType('outputHumanReadableAbi', 'boolean');
const checkOutputMinimal = checkType('outputMinimal', 'boolean');
const checkOutputType = checkEnum('outputType', ['multiple', 'combined', 'all']);

function checkType(key: string, type: 'string' | 'boolean' | 'object') {
  return function (value: unknown) {
    if (typeof value !== type) { // eslint-disable-line valid-typeof
      console.warn(`${key} must be ${type}, received: ${typeof value}`);
      return false;
    }
    return true;
  };
}

function checkEnum(key: string, values: unknown[]) {
  return function (value: unknown) {
    if (!values.includes(value)) {
      console.warn(`${key} must be one of: ${values.join(', ')}, received: ${value}`);
      return false;
    }
    return true;
  };
}
