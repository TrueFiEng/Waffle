import { compileAndSave } from '@ethereum-waffle/compiler';
import { inputToConfig } from '../waffle-compiler/src/config';
import { generateTypes } from '../waffle-compiler/src/generateTypes';

const buildExampleContracts = async () => {
  console.log('Building example contracts...');
  const sourceDirectory = './test/projects/example';
  const outputDirectory = './test/example/build';
  const flattenOutputDirectory = './test/example/flatten';
  const nodeModulesDirectory = 'node_modules';
  const compilerVersion = 'v0.5.9+commit.e560f70d';
  await compileAndSave({
    sourceDirectory,
    outputDirectory,
    flattenOutputDirectory,
    nodeModulesDirectory,
    compilerVersion
  });
};
const buildExampleTypes = async () => {
  console.log('Building example types...');
  await generateTypes(inputToConfig({outputDirectory: './test/example/build', typechain: {enabled: true, outputDir: '../../../build'}}))
}

(async function () {
  await buildExampleContracts();
  await buildExampleTypes();
})().catch(console.error)
