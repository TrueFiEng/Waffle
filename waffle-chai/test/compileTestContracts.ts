import {compileAndSave} from '@ethereum-waffle/compiler';

const compile = async () => {
  console.log('Compiling mocking contract...');
  await compileAndSave({
    sourceDirectory: './test/contracts',
    outputDirectory: './test/interfaces',
    compilerVersion: '0.8.3'
  });
};

compile();