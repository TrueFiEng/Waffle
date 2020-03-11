import {compileAndSave} from '@ethereum-waffle/compiler';

const buildExampleContracts = async () => {
  console.log('Building example contracts...');
  const sourceDirectory = './test/projects/example';
  const outputDirectory = './test/example/build';
  const nodeModulesDirectory = 'node_modules';
  await compileAndSave({sourceDirectory, outputDirectory, nodeModulesDirectory});
};

buildExampleContracts();
