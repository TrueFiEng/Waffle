import {loadConfig} from './loadConfig';
import {Config, InputConfig, inputToConfig} from './config';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';
import {gatherSources} from '@resolver-engine/imports';
import {findInputs} from './findInputs';
import mkdirp from 'mkdirp';
import fsx from 'fs-extra';
import * as path from 'path';
import {join} from 'path';

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

  const allContracts = findInputs(config.sourceDirectory);

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
  const IMPORT_SOLIDITY_REGEX = /import/gi;
  const PRAGMA_SOLIDITY_REGEX = /pragma/gi;
  const outputDirectory = config.flattenOutputDirectory;

  fileSystem.createDirectory(outputDirectory);

  output.map((contract: Array<GatheredContractInterface>) => {
    const fileName = path.parse(contract[0].url).base;
    const filePath = join(outputDirectory, fileName);
    let source = '';

    contract.map((dependency) => {
      const sourceWithCommentedImports = dependency.source.replace(IMPORT_SOLIDITY_REGEX, '// import');

      if (dependency === contract[0]) {
        source = sourceWithCommentedImports;
      } else {
        const sourceWithCommentedPragmas = sourceWithCommentedImports.replace(PRAGMA_SOLIDITY_REGEX, '// pragma');
        source = `// Dependency file: ${dependency.url}\n\n` + sourceWithCommentedPragmas + '\n' + source;
      }
    });
    fileSystem.writeFile(filePath, source);
  });
}
