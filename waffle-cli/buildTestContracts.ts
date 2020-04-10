import {compileAndSave} from '@ethereum-waffle/compiler';

const buildExampleContracts = async () => {
  console.log('Building example contracts...');
  const sourceDirectory = './test/projects/example';
  const compileOutputDirectory = './test/example/build';
  const flattenOutputDirectory = './test/example/flatten';
  const nodeModulesDirectory = 'node_modules';
  const compilerVersion = 'v0.5.9+commit.e560f70d';
  await compileAndSave({
    sourceDirectory,
    compileOutputDirectory,
    flattenOutputDirectory,
    nodeModulesDirectory,
    compilerVersion
  });
};

buildExampleContracts();
