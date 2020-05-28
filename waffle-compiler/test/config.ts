import {expect} from 'chai';
import {inputToConfig, defaultConfig} from '../src/config';

describe('UNIT: inputToConfig', () => {
  it('strips non-standard properties', () => {
    const input = {
      name: 'name',
      compilerType: 'native',
      compilerOptions: {},
      foo: 'bar',
      boo: 123
    }
    const output = {
      compilerType: 'native',
      compilerOptions: {},
    }

    expect(inputToConfig(input as any)).to.deep.equal({
      ...defaultConfig,
      ...output
    });
  });

  describe('invalid configs', () => {
    const testCases = [
      {
        name: 'sourceDirectory non-string',
        sourceDirectory: 2
      },
      {
        name: 'outputDirectory non-string',
        outputDirectory: []
      },
      {
        name: 'nodeModulesDirectory non-string',
        nodeModulesDirectory: false
      },
      {
        name: 'compilerType non-string',
        compilerType: false
      },
      {
        name: 'compilerType string',
        compilerType: 'foo'
      },
      {
        name: 'compilerVersion non-string',
        compilerVersion: 1234
      },
      {
        name: 'compilerAllowedPaths non-array',
        compilerAllowedPaths: 'foo'
      },
      {
        name: 'compilerAllowedPaths non-string array',
        compilerAllowedPaths: [1234, 'foo']
      },
      {
        name: 'compilerOptions string',
        compilerAllowedPaths: 'foo'
      },
      {
        name: 'outputHumanReadableAbi string',
        outputHumanReadableAbi: 'foo'
      },
      {
        name: 'outputType non-string',
        outputType: 1
      },
      {
        name: 'outputType string',
        outputType: 'foo'
      }
    ];

    for (const testCase of testCases) {
      it(testCase.name, () => {
        expect(() => inputToConfig(testCase as any)).to.throw(TypeError);
      });
    }
  });
});
