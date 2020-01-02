import {compileAndSave} from '@waffle/compiler';

const buildExampleContracts = async () => {
  console.log('Building example contracts...');
  const sourcesPath = './test/projects/example';
  const targetPath = './test/example/build';
  const npmPath = 'node_modules';
  await compileAndSave({sourcesPath, targetPath, npmPath});
};

buildExampleContracts();
