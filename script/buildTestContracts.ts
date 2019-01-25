import {compile} from '../lib/compiler/compiler';
import defaultConfig from '../lib/config/config';

const buildExampleContracts = async () => {
  console.log('Building example contracts...');
  const sourcesPath = './test/projects/example';
  const targetPath = './test/example/build';
  const config = {...defaultConfig, sourcesPath, targetPath};
  await compile(config);
};

const buildMatchers = async () => {
  console.log('Building matchers contracts...');
  const sourcesPath = './test/matchers/contracts';
  const targetPath = './test/matchers/build';
  const config = {...defaultConfig, sourcesPath, targetPath};
  await compile(config);
};

const buildAll = async () => {
  await buildExampleContracts();
  await buildMatchers();
};

buildAll();
