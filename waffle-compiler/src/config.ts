import {deprecate} from './deprecate';

export interface NewConfig {
  /** Location of the project sources e.g. ./contracts */
  inputDirectory: string;
  /** Location of the compilation artifacts e.g. ./dist */
  outputDirectory: string;
  /** Location of the dependencies e.g. ./node_modules */
  nodeModulesDirectory: string;

  /**
   * Compiler type:
   * - native - uses local installation of solc
   * - dockerized-solc - uses solc from a docker image
   * - solcjs - uses solc from the solcjs npm package
   */
  compilerType: 'native' | 'dockerized-solc' | 'solcjs';
  /** Version of the solidity compiler e.g. "0.5.1" or "default" */
  compilerVersion: string;
  /** Enable optimisation */
  compilerOptimize: boolean;
  /**
   * Additional allowed paths for the compiler.
   * Only used for native compiler type.
   */
  compilerAllowedPaths: string[];
  /** Options passed to the compiler */
  compilerOptions: object;

  /** Include the humanReadableAbi format */
  outputHumanReadableAbi: boolean;
  /** Only output abi and bytecode */
  outputMinimal: boolean;
  /**
   * What files should be outputted
   * - multiple - single file for each contract
   * - combined - single file for all contracts
   * - all - both of the above
   */
  outputType: 'multiple' | 'combined' | 'all';
}

export interface LegacyConfig {
  sourcesPath?: string;
  targetPath?: string;
  npmPath?: string;
  compiler?: 'native' | 'dockerized-solc' | 'solcjs';
  'docker-tag'?: string;
  solcVersion?: string;
  legacyOutput?: string;
  allowedPaths?: string[];
  compilerOptions?: Record<string, any>;
  outputType?: 'multiple' | 'combined' | 'all';
  outputHumanReadableAbi?: boolean;
  ganacheOptions?: Record<string, any>;
}

const defaultConfig: NewConfig = {
  inputDirectory: './contracts',
  outputDirectory: './build',
  nodeModulesDirectory: './node_modules',
  compilerType: 'solcjs',
  compilerVersion: 'default',
  compilerOptimize: false,
  compilerAllowedPaths: [],
  compilerOptions: {},
  outputHumanReadableAbi: false,
  outputMinimal: false,
  outputType: 'multiple'
};

export type Config = Partial<NewConfig> & LegacyConfig
export function toNewConfig(input: Config) {
  const result: any = {...defaultConfig};
  function set(key: string, value: any) {
    result[key] = value;
  }

  for (const key in input) {
    if ((input as any)[key]) {
      if (key in defaultConfig) {
        set(key, (input as any)[key]);
      } else if (key === 'sourcesPath') {
        deprecate('sourcesPath', 'Use inputDirectory instead.');
        set('inputDirectory', input[key]);
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

function validate(config: any): asserts config is NewConfig {
  // TODO: check if all values match schema
}
