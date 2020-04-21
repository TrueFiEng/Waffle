import {loadConfig} from './loadConfig';
import {Config, InputConfig, inputToConfig} from './config';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';
import {gatherSources} from '@resolver-engine/imports';
import {findInputs} from './findInputs';
import mkdirp from 'mkdirp';
import fsx from 'fs-extra';
import * as path from 'path';
import {join} from 'path';
import {getExtensionForCompilerType} from './utils';

export interface GatheredContractInterface {
  url: string;
  source: string;
  provider: string;
}

export async function flattenProject(configPath?: string) {
  await flattenAndSave(await loadConfig(configPath));
}

export async function flattenAndSave(input: InputConfig) {
  const config = inputToConfig(input);
  const output = await getContractDependency(config);
  await saveToFile(output, config);
}

async function getContractDependency(config: Config): Promise<GatheredContractInterface[][]> {
  const resolver = ImportsFsEngine().addResolver(
    resolvers.BacktrackFsResolver(config.nodeModulesDirectory)
  );

  const allContracts = findInputs(config.sourceDirectory, getExtensionForCompilerType(config));

  return Promise.all(allContracts.map(async contract => gatherSources(
    [contract],
    '.',
    resolver
  )));
}

const fsOps = {
  createDirectory: mkdirp.sync,
  writeFile: fsx.writeFileSync
};

function saveToFile(
  output: GatheredContractInterface[][],
  config: Config,
  fileSystem = fsOps
) {
  const outputDirectory = config.flattenOutputDirectory;

  fileSystem.createDirectory(outputDirectory);

  output.map((contract: Array<GatheredContractInterface>) => {
    const fileName = path.parse(contract[0].url).base;
    const filePath = join(outputDirectory, fileName);
    let source = '';

    contract.map(dependency => {
      source = replaceDirectivesWithComments(dependency, contract, source);
    });
    fileSystem.writeFile(filePath, source);
  });
}

function replaceDirectivesWithComments(
  dependency: GatheredContractInterface,
  contract: Array<GatheredContractInterface>,
  source: string
) {
  const IMPORT_SOLIDITY_REGEX = /import/gi;
  const PRAGMA_SOLIDITY_REGEX = /pragma/gi;

  const sourceWithCommentedImports = dependency.source.replace(IMPORT_SOLIDITY_REGEX, '// import');

  if (dependency === contract[0]) {
    return sourceWithCommentedImports;
  } else {
    const sourceWithCommentedPragmas = sourceWithCommentedImports.replace(PRAGMA_SOLIDITY_REGEX, '// pragma');
    return `// Dependency file: ${dependency.url}\n\n` + sourceWithCommentedPragmas + '\n' + source;
  }
}
