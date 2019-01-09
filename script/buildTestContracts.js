import Compiler from '../lib/compiler';

const buildExampleContracts = async () => {
  console.log('Building example contracts...');
  const sourcesPath = './test/projects/example';
  const targetPath = './test/example/build';
  const config = {sourcesPath, targetPath};
  const compiler = new Compiler(config);
  await compiler.compile();
};

const buildMatchers = async () => {
  console.log('Building matchers contracts...');
  const sourcesPath = './test/matchers/contracts';
  const targetPath = './test/matchers/build';
  const config = {sourcesPath, targetPath};
  const compiler = new Compiler(config);
  await compiler.compile();
};

const buildAll = async () => {
  await buildExampleContracts();
  await buildMatchers();
};

buildAll();
