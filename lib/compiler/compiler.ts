import {Config} from '../config/config';
import {isWarningMessage} from '../utils';
import {createWrapper, Wrapper} from './createWrapper';
import {findInputs} from './findInputs';
import {findImports} from './findImports';
import {loadConfig} from '../config/loadConfig';

export async function compileProject(configPath: string) {
  await compileAndSave(loadConfig(configPath));
}

export async function compileAndSave(config: Config) {
  const wrapper = createWrapper(config);
  const output = await compile(config, wrapper);
  await processOutput(output, wrapper, config.targetPath);
}

export async function compile(config: Config, wrapper: Wrapper = createWrapper(config)) {
  return wrapper.compile(
    findInputs(config.sourcesPath),
    findImports(config.npmPath)
  );
}

async function processOutput(output: any, wrapper: Wrapper, targetPath: string) {
  if (output.errors) {
    const errors = output.errors
      .map((error: any) => toFormattedMessage(error))
      .join('\n');
    console.error(errors);
  }
  if (anyNonWarningErrors(output.errors)) {
    throw new Error('Compilation failed');
  } else {
    await wrapper.saveOutput(output, targetPath);
  }
}

function anyNonWarningErrors(errors?: any[]) {
  return errors && !errors.every(isWarningMessage)
}

function toFormattedMessage(error: any) {
  return typeof error === 'string' ? error : error.formattedMessage;
}
