import {Config} from '../config/config';
import {isWarningMessage} from '../utils';
import {createWrapper} from './createWrapper';
import {findInputs} from './findInputs';
import {findImports} from './findImports';
import {loadConfig} from '../config/loadConfig';
import {saveOutput} from './saveOutput';

export async function compileProject(configPath: string) {
  await compileAndSave(loadConfig(configPath));
}

export async function compileAndSave(config: Config) {
  const output = await compile(config);
  await processOutput(output, config);
}

export async function compile(config: Config) {
  const wrapper = createWrapper(config);
  return wrapper.compile(
    findInputs(config.sourcesPath),
    findImports(config.npmPath)
  );
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
  return errors && !errors.every(isWarningMessage)
}

function formatErrors(errors: any[]) {
  return errors.map(toFormattedMessage).join('\n');
}

function toFormattedMessage(error: any) {
  return typeof error === 'string' ? error : error.formattedMessage;
}
