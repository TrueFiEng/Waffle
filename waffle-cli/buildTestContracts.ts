import {compileAndSave} from '@ethereum-waffle/compiler';

const buildExampleContracts = async () => {
  console.log('Building example contracts...');
  const sourceDirectory = './test/projects/example';
  const outputDirectory = './test/example/build';
  const nodeModulesDirectory = 'node_modules';
  const compilerVersion = 'v0.5.9+commit.e560f70d'
  await compileAndSave({sourceDirectory, outputDirectory, nodeModulesDirectory, compilerVersion});
};

buildExampleContracts();
