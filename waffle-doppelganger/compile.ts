import {compileAndSave} from '@ethereum-waffle/compiler';

const compile = async () => {
  console.log('Compiling mocking contract...');
  await compileAndSave({
    outputDirectory: './src'
  });
};

compile();
