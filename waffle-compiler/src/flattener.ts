import {loadConfig} from './loadConfig';
import {Config, InputConfig, inputToConfig} from './config';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';
import {gatherSources} from '@resolver-engine/imports';
import {findInputs} from './findInputs';
import {isWarningMessage} from './utils';
import mkdirp from 'mkdirp';
import fsx from 'fs-extra';
import * as path from 'path';
import {join} from 'path';

export interface GatheredContractInterface {
  url: string;
  source: string;
  provider: string;
}

export const IMPORT_SOLIDITY_REGEX = /^\s*import(\s+).*$/gm;

export async function flattenProject(configPath?: string) {
  await flattenAndSave(await loadConfig(configPath));
}

export async function flattenAndSave(input: InputConfig) {
  const config = inputToConfig(input);
  const output = await getContractDependency(config);
  await processOutput(output, config);
}

async function getContractDependency(config: Config): Promise<GatheredContractInterface[][]> {
  const resolver = ImportsFsEngine().addResolver(
    resolvers.BacktrackFsResolver(config.nodeModulesDirectory)
  );

  const allContracts = findInputs(config.sourceDirectory);

  const contractsDependency = await Promise.all(allContracts.map(async contract => {
    return gatherSources(
      [contract],
      '.',
      resolver
    );
  }));

  return contractsDependency.map((contract: Array<GatheredContractInterface>) => {
    return contract.map((dependency) => {
      dependency.source = dependency.source.replace(IMPORT_SOLIDITY_REGEX, '');
      return dependency;
    });
  });
}

async function processOutput(output: any, config: Config) {
  if (output.errors) {
    console.error(formatErrors(output.errors));
  }
  if (anyNonWarningErrors(output.errors)) {
    throw new Error('Flattening failed');
  } else {
    return saveToFile(output, config);
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
  writeFile: fsx.writeFileSync
};

function saveToFile(
  output: any,
  config: Config,
  fileSystem = fsOps
) {
  const outputDirectory = config.flattenOutputDirectory;
  fileSystem.createDirectory(outputDirectory);
  output.map((contract: Array<GatheredContractInterface>) => {
    const fileName = path.parse(contract[0].url).base;
    const filePath = join(outputDirectory, fileName);
    let dependencies = '';
    contract.map((dependency) => {
      if (dependency !== contract[0]) {
        dependencies += '\n\n' + `// Dependency file: ${dependency.url}`;
      }
      dependencies += dependency.source;
    });
    fileSystem.writeFile(filePath, dependencies);
  });
}
