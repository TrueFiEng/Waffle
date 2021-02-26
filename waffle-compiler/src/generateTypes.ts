import path from 'path';
import {tsGenerator} from 'ts-generator';
import {TypeChain} from 'typechain/dist/TypeChain';
import {Config} from './config';

export async function generateTypes(config: Config) {
  await tsGenerator(
    {cwd: config.outputDirectory},
    new TypeChain({
      cwd: config.outputDirectory,
      rawConfig: {files: '*.json', outDir: config.typechainOutputDir, target: 'ethers-v5'}
    }));
  return path.join(config.outputDirectory, config.typechainOutputDir);
}
