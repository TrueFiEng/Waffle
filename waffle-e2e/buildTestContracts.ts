// eslint-disable-next-line import/no-extraneous-dependencies
import {compileAndSave} from '@ethereum-waffle/compiler';

compileAndSave({
  sourceDirectory: './src',
  outputDirectory: './build',
  compilerVersion: '0.5.15'
});
