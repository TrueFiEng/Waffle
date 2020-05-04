import {compileAndSave} from '@ethereum-waffle/compiler';

const buildExampleContracts = async () => {
  const sourceDirectory = './src';
  const outputDirectory = './dist';
  const compilerVersion = '0.5.15';

  await compileAndSave({
    sourceDirectory,
    outputDirectory,
    compilerVersion
  });
};

buildExampleContracts();
