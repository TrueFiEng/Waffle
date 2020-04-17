import {compileAndSave} from '@ethereum-waffle/compiler';

const buildTestContracts = async () => {
  console.log('Building contracts...');
  const sourceDirectory = './test/helpers/contracts';
  const outputDirectory = './test/helpers/interfaces';
  await compileAndSave({
    sourceDirectory,
    outputDirectory
  });
};

buildTestContracts();
