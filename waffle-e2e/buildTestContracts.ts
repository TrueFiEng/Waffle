import {compileAndSave} from '@ethereum-waffle/compiler';

compileAndSave({
  sourceDirectory: './src',
  outputDirectory: './build',
  compilerVersion: '0.5.15'
});
