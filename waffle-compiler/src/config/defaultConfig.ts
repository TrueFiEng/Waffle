import {Config} from './config';

export const defaultConfig: Config = {
  sourceDirectory: './contracts',
  outputDirectory: './build',
  flattenOutputDirectory: './flatten',
  nodeModulesDirectory: './node_modules',
  cacheDirectory: './cache',
  compilerType: 'solcjs',
  compilerVersion: 'default',
  compilerAllowedPaths: [],
  compilerOptions: {},
  outputHumanReadableAbi: false,
  outputType: 'multiple',
  typechainEnabled: false,
  typechainOutputDir: 'types'
};
