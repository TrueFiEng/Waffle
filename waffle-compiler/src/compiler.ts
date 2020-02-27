import {InputConfig, toNewConfig, Config} from './config';
import {isWarningMessage} from './utils';
import {getCompileFunction} from './getCompileFunction';
import {findInputs} from './findInputs';
import {findImports} from './findImports';
import {loadConfig} from './loadConfig';
import {saveOutput} from './saveOutput';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';
import {gatherSources} from '@resolver-engine/imports';

export async function compileProject(configPath?: string) {
  await compileAndSave(await loadConfig(configPath));
}

export async function compileAndSave(input: InputConfig) {
  const config = toNewConfig(input);
  const output = await compile(config);
  await processOutput(output, config);
}

export async function compile(input: InputConfig) {
  return newCompile(toNewConfig(input));
}

async function newCompile(config: Config) {
  const resolver = ImportsFsEngine().addResolver(
    // Backwards compatibility - change node_modules path
    resolvers.BacktrackFsResolver(config.nodeModulesDirectory)
  );
  const sources = await gatherSources(
    findInputs(config.inputDirectory),
    '.',
    resolver
  );
  return getCompileFunction(config)(sources, findImports(sources));
}

async function processOutput(output: any, config: Config) {
  if (output.errors) {
    console.error(formatErrors(output.errors));
  }
  if (anyNonWarningErrors(output.errors)) {
    throw new Error('Compilation failed');
  } else {
    await saveOutput(output, config);
  }
}

function anyNonWarningErrors(errors?: any[]) {
  return errors && !errors.every(isWarningMessage);
}

function formatErrors(errors: any[]) {
  return errors.map(toFormattedMessage).join('\n');
}

function toFormattedMessage(error: any) {
  return typeof error === 'string' ? error : error.formattedMessage;
}
