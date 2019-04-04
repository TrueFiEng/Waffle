import defaultConfig, {Config} from '../config/config';
import {isWarningMessage} from '../utils';
import {getCompileFunction} from './getCompileFunction';
import {findInputs} from './findInputs';
import {findImports} from './findImports';
import {loadConfig} from '../config/loadConfig';
import {saveOutput} from './saveOutput';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';
import {gatherSources} from '@resolver-engine/imports';

export async function compileProject(configPath: string) {
  await compileAndSave(await loadConfig(configPath));
}

export async function compileAndSave(config: Config) {
  const output = await compile(config);
  await processOutput(output, config);
}

export async function compile(config: Config) {
  // Added support for backwards compatibillity - renamable node_modules path
  const resolver = ImportsFsEngine().addResolver(
    resolvers.BacktrackFsResolver(config.npmPath)
  );
  const sources = await gatherSources(
    findInputs(config.sourcesPath),
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
