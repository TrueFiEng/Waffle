import path from 'path';
import {runTypeChain, glob} from 'typechain';
import {Config} from './config';

export async function generateTypes(config: Config) {
  const cwd = config.outputDirectory;
  const allFiles = glob(cwd, ['*.json']);
  await runTypeChain({
    cwd,
    allFiles,
    filesToProcess: allFiles,
    target: 'ethers-v5',
    outDir: config.typechainOutputDir
  });
  return path.join(config.outputDirectory, config.typechainOutputDir);
}
