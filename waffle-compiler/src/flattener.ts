import {loadConfig} from './loadConfig';
import {Config, InputConfig, inputToConfig} from './config';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';
import {gatherSources} from '@resolver-engine/imports';
import {findInputs} from './findInputs';
import {isWarningMessage} from './utils';
import mkdirp from 'mkdirp';
import fs from 'fs';
import {join} from 'path';
import * as path from 'path';

export const IMPORT_SOLIDITY_REGEX = /^\s*import(\s+).*$/gm;

export async function flattenProject(configPath?: string) {
  await flattenAndSave(await loadConfig(configPath));
}

export async function flattenAndSave(input: InputConfig) {
  const config = inputToConfig(input);
  const output = await newFlatten(config);
  await processOutput(output, config);
}

export async function flatten(input: InputConfig): Promise<Array<{ url: string; source: string; provider: string }>> {
  return newFlatten(inputToConfig(input));
}

async function newFlatten(config: Config): Promise<Array<{ url: string; source: string; provider: string }>> {
  const resolver = ImportsFsEngine().addResolver(
    // Backwards compatibility - change node_modules path
    resolvers.BacktrackFsResolver(config.nodeModulesDirectory)
  );

  const importFiles = await gatherSources(
    findInputs(config.sourceDirectory),
    '.',
    resolver
  );

  return importFiles.map(contract => {
    contract.source = contract.source.replace(IMPORT_SOLIDITY_REGEX, '');
    return contract;
  });
}

async function processOutput(output: any, config: Config) {
  if (output.errors) {
    console.error(formatErrors(output.errors));
  }
  if (anyNonWarningErrors(output.errors)) {
    throw new Error('Flattening failed');
  } else {
    await saveToFile(output, config);
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

const fsOps = {
  createDirectory: mkdirp.sync,
  writeFile: fs.writeFileSync
};

function saveToFile(
  output: any,
  config: Config,
  fileSystem = fsOps
) {
  const outputDirectory = config.flattenOutputDirectory;
  fileSystem.createDirectory(outputDirectory);
  output.map((contract: { url: string; source: string; provider: string }) => {
    const fileName = path.parse(contract.url).base;
    const filePath = join(outputDirectory, fileName);
    fileSystem.writeFile(filePath, contract.source);
  });
}
