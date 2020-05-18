import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import {Config, InputConfig, inputToConfig, loadConfig} from './config';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';
import {gatherSourcesAndCanonizeImports} from '@resolver-engine/imports';
import {findInputs} from './findInputs';
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

  return Promise.all(allContracts.map(async contract => gatherSourcesAndCanonizeImports(
    [contract],
    '.',
    resolver
  )));
}

const fsOps = {
  createDirectory: mkdirp.sync,
  writeFile: fs.writeFileSync
};

const unique = <T>(arr: T[]) => [...new Set(arr)];

function saveToFile(
  output: GatheredContractInterface[][],
  config: Config,
  fileSystem = fsOps
) {
  const outputDirectory = config.flattenOutputDirectory;

  fileSystem.createDirectory(outputDirectory);

  output.map((contract: Array<GatheredContractInterface>) => {
    const fileName = path.parse(contract[contract.length - 1].url).base;
    const filePath = path.join(outputDirectory, fileName);
    const source = ''.concat(...unique(contract.map(replaceDirectivesWithComments(contract[contract.length - 1]))));

    fileSystem.writeFile(filePath, source);
  });
}

function replaceDirectivesWithComments(contract: GatheredContractInterface) {
  const IMPORT_SOLIDITY_REGEX = /import/gi;
  const IMPORT_NODE_MODULES_REGEX = /(import.*").*node_modules\/(.*\n)/gi;
  const PRAGMA_SOLIDITY_REGEX = /pragma solidity/gi;
  const NODE_MODULES_REGEX = /^.*\/node_modules\//gi;

  return (dependency: GatheredContractInterface) => {
    const sourceWithImportsWithRelativeImports = dependency.source.replace(IMPORT_NODE_MODULES_REGEX, '$1$2');
    const sourceWithCommentedImports = sourceWithImportsWithRelativeImports.replace(IMPORT_SOLIDITY_REGEX, '// import');
    const filePath = dependency.url.replace(NODE_MODULES_REGEX, '');

    if (dependency === contract) {
      return `// Root file: ${filePath}\n\n` + sourceWithCommentedImports;
    }

    const sourceWithCommentedPragmas = sourceWithCommentedImports.replace(PRAGMA_SOLIDITY_REGEX, '// pragma solidity');
    return `// Dependency file: ${filePath}\n\n` + sourceWithCommentedPragmas + '\n\n';
  };
}
