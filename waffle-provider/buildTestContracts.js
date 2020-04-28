const compiler = require('@ethereum-waffle/compiler');

compiler.compileAndSave({
  compilerType: 'solcjs',
  compilerVersion: '0.5.0',
  sourceDirectory: './test/test-sources',
  outputDirectory: './test/test-build-output',
  compilerOptions: {
    metadata: {
      useLiteralContent: true
    }
  }
});
