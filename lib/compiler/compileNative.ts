import {join, resolve} from 'path';
import {execSync} from 'child_process';
import {Config} from '../config/config';
import ImportMappingBuilder from './importMappingBuilder';
import {buildInputObject, buildSources} from './buildUitls';

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
  return buildInputObject(
    buildSources(sources, input => join(process.cwd(), input)),
    getMappings(sources, config),
  );
}

function getMappings(sources: string[], config: Config) {
  const mappingBuilder = new ImportMappingBuilder(config.sourcesPath, config.npmPath);
  return mappingBuilder.getMappings(sources);
}