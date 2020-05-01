import {compileAndSave} from '@ethereum-waffle/compiler';

const buildExampleContracts = async () => {
  const sourceDirectory = './test-sources';
  const outputDirectory = './test-build-output';
  const compilerVersion = '0.5.0';

  await compileAndSave({
    sourceDirectory,
    outputDirectory,
    compilerVersion
  });
};

buildExampleContracts();
