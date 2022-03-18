import {InputConfig, inputToConfig, Config, loadConfig} from './config';
import {getExtensionForCompilerType} from './utils';
import {getCompileFunction} from './getCompileFunction';
import {findInputs} from './findInputs';
import {saveOutput} from './saveOutput';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';
import {gatherSources} from '@resolver-engine/imports';
import {generateTypes} from './generateTypes';

export async function compileProject(configPath?: string) {
  const partialConfig = await loadConfig(configPath);
  await compileAndSave(partialConfig);
  const config = inputToConfig(partialConfig);
  if (config.typechainEnabled) {
    await generateTypes(config);
  }
}

export async function compileAndSave(input: InputConfig) {
  const config = inputToConfig(input);
  const output = await compile(config);
  await processOutput(output, config);
}

export async function compile(input: InputConfig) {
  return newCompile(inputToConfig(input));
}

async function newCompile(config: Config) {
  console.log('new compile..')
  const importsFsEngine = ImportsFsEngine();
  console.log('adding resolved..')
  const resolver = importsFsEngine.addResolver(
    // Backwards compatibility - change node_modules path
    resolvers.BacktrackFsResolver(config.nodeModulesDirectory)
  );
  console.log('gathering sources...')
  const sources = await gatherSources(
    findInputs(config.sourceDirectory, getExtensionForCompilerType(config)),
    '.',
    resolver
  );
  console.log('sources gathered.')
  console.log(sources)
  return getCompileFunction(config)(sources);
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
  return errors && !errors.every(error => error.severity === 'warning');
}

function formatErrors(errors: any[]) {
  return errors.map(toFormattedMessage).join('\n');
}

function toFormattedMessage(error: any) {
  return typeof error === 'string' ? error : error.formattedMessage;
}
