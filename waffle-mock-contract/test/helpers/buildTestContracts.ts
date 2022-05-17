import {compileAndSave} from '@ethereum-waffle/compiler';

const buildTestContracts = async () => {
  console.log('Building contracts...');
  await compileAndSave({
    sourceDirectory: './test/helpers/contracts',
    outputDirectory: './test/helpers/interfaces',
    compilerVersion: '0.6.3'
  });
};

void buildTestContracts();
