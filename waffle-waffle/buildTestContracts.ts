import {compileAndSave} from './src/compiler/compiler';
import defaultConfig from './src/config/config';

const buildExampleContracts = async () => {
  console.log('Building example contracts...');
  const sourcesPath = './test/projects/example';
  const targetPath = './test/example/build';
  const config = {...defaultConfig, sourcesPath, targetPath};
  await compileAndSave(config);
};

buildExampleContracts();
