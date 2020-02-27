import {expect} from 'chai';
import {inputToConfig, defaultConfig} from '../src/config';

describe('UNIT: inputToConfig', () => {
  describe('successful transformations', () => {
    const testCases = [
      {
        name: 'compilerOptions',
        input: {
          compilerOptions: {
            evmVersion: 'constantinople',
            outputSelection: {
              '*': {
                '*': [
                  'evm.bytecode.object',
                  'evm.deployedBytecode.object',
                  'abi',
                  'evm.bytecode.sourceMap',
                  'evm.deployedBytecode.sourceMap'
                ],
                '': ['ast']
              }
            }
          }
        },
        output: {
          compilerOptions: {
            evmVersion: 'constantinople',
            outputSelection: {
              '*': {
                '*': [
                  'evm.bytecode.object',
                  'evm.deployedBytecode.object',
                  'abi',
                  'evm.bytecode.sourceMap',
                  'evm.deployedBytecode.sourceMap'
                ],
                '': ['ast']
              }
            }
          }
        }
      },
      {
        name: 'native',
        input: {
          compiler: 'native'
        },
        output: {
          compilerType: 'native'
        }
      },
      {
        name: 'docker',
        input: {
          compiler: 'dockerized-solc',
          'docker-tag': '0.5.15'
        },
        output: {
          compilerType: 'dockerized-solc',
          compilerVersion: '0.5.15'
        }
      },
      {
        name: 'solc',
        input: {
          compiler: 'solcjs',
          'docker-tag': 'v0.4.24+commit.e67f0147'
        },
        output: {
          compilerVersion: 'v0.4.24+commit.e67f0147'
        }
      },
      {
        name: 'KLAB friendly configuration 1',
        input: {
          outputType: 'all'
        },
        output: {
          outputType: 'all'
        }
      },
      {
        name: 'KLAB friendly configuration 2',
        input: {
          outputType: 'combined'
        },
        output: {
          outputType: 'combined'
        }
      },
      {
        name: 'paths',
        input: {
          sourcesPath: './test/projects/custom/custom_contracts',
          targetPath: './test/projects/custom/custom_build',
          npmPath: '../custom_node_modules'
        },
        output: {
          sourceDirectory: './test/projects/custom/custom_contracts',
          outputDirectory: './test/projects/custom/custom_build',
          nodeModulesDirectory: '../custom_node_modules'
        }
      },
      {
        name: 'human readable abi',
        input: {
          outputHumanReadableAbi: true
        },
        output: {
          outputHumanReadableAbi: true
        }
      },
      {
        name: 'empty',
        input: {},
        output: {}
      },
      {
        name: 'new config',
        input: {
          sourceDirectory: './test/projects/custom/custom_contracts',
          outputDirectory: './test/projects/custom/custom_build',
          nodeModulesDirectory: '../custom_node_modules'
        },
        output: {
          sourceDirectory: './test/projects/custom/custom_contracts',
          outputDirectory: './test/projects/custom/custom_build',
          nodeModulesDirectory: '../custom_node_modules'
        }
      }
    ];

    for (const testCase of testCases) {
      it(testCase.name, () => {
        expect(inputToConfig(testCase.input as any)).to.deep.equal({
          ...defaultConfig,
          ...testCase.output
        });
      });
    }
  });

  describe('invalid configs', () => {
    // TODO: test
  })
});
