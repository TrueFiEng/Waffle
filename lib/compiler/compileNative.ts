import {join, resolve} from 'path';
import {execSync} from 'child_process';
import {Config} from '../config/config';
import ImportMappingBuilder from './importMappingBuilder';

export function compileNative(config: Config) {
  return async function compile(sources: string[]) {
    const command = createBuildCommand(config);
    const input = JSON.stringify(buildInputJson(sources, config), null, 2);
    return JSON.parse(execSync(command, {input}).toString());
  }
}

export function createBuildCommand(config: Config) {
  const command = 'solc';
  const params = '--standard-json';
  const customAllowedPaths = (config.allowedPaths || []).map((path: string) => resolve(path));
  const allowedPaths = [resolve(config.sourcesPath), resolve(config.npmPath), ...customAllowedPaths];
  return `${command} ${params} --allow-paths ${allowedPaths.join(',')}`;
}

function buildInputJson(sources: string[], config: Config) {
  return {
    language: 'Solidity',
    sources: buildSources(sources),
    settings: {
      remappings: getMappings(sources, config),
      outputSelection: {'*': {'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']}}
    }
  };
}

function buildSources(inputs: string[]) {
  const sources: Record<string, { urls: string[] }> = {};
  for (const input of inputs) {
    sources[input.replace(/\\/g, '/')] = {urls: [
      join(process.cwd(), input)
    ]};
  }
  return sources;
}

function getMappings(sources: string[], config: Config) {
  const mappingBuilder = new ImportMappingBuilder(config.sourcesPath, config.npmPath);
  const mappings = mappingBuilder.getMappings(sources);
  return Object.entries(mappings).map(([key, value]) => `${key}=${value}`);
}