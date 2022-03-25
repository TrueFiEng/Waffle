import {
  compileAndSave,
  generateTypes,
  inputToConfig
} from '@ethereum-waffle/compiler';

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
  await generateTypes(
    inputToConfig({
      outputDirectory: './test/example/build',
      typechainEnabled: true,
      typechainOutputDir: '../../../build'
    })
  );
};

(async function () {
  await buildExampleContracts();
  await buildExampleTypes();
})().catch(console.error);
