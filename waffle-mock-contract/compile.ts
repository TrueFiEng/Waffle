import {compileAndSave} from '@ethereum-waffle/compiler';

const compile = async () => {
  console.log('Compiling mocking contract...');
  await compileAndSave({
    sourceDirectory: './src',
    outputDirectory: './src',
    compilerVersion: '0.6.3'
  });
};

compile();
