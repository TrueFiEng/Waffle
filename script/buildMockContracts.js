import Compiler from '../lib/compiler';

const buildMockContracts = async () => {
  console.log('Building mock contracts...');
  const sourcesPath = './contracts';
  const targetPath = './build';
  const config = {sourcesPath, targetPath};
  const compiler = new Compiler(config);
  await compiler.compile();
};

buildMockContracts();
