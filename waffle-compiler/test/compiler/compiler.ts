import {expect} from 'chai';
import sinon from 'sinon';
import {compile, compileAndSave} from '../../src/compiler';
import {inputToConfig} from '../../src/config';

const sourceDirectory = './test/projects/example';
const compileOutputDirectory = './test/compiler/build';
const compilerVersion = 'v0.5.9+commit.e560f70d';
const config = inputToConfig({
  sourceDirectory,
  compileOutputDirectory,
  compilerVersion
});

describe('INTEGRATION: Compiler', () => {
  it('compile just compiles', async () => {
    const output = await compile(config);
    const basicTokenOutput = output.contracts[
      'test/projects/example/BasicToken.sol'
    ].BasicToken;
    expect(output.errors).to.equal(undefined);
    expect(basicTokenOutput.evm.bytecode.object).to.startsWith('6080604052');
    expect(JSON.stringify(basicTokenOutput.abi)).to.startsWith('[{"constant":true,');
  });

  describe('compileAndSave: invalid input', () => {
    const sourceDirectory = './test/projects/invalidContracts'; // tslint:disable-line
    const compileOutputDirectory = './test/projects/build'; // tslint:disable-line
    const config = inputToConfig({sourceDirectory, compileOutputDirectory, compilerVersion});
    const expectedOutput = `${'test/projects/invalidContracts/invalid.sol'}:6:14: ` +
      'DeclarationError: Identifier not found or not unique.\n' +
      '  function f(wrongType arg) public {\n             ^-------^\n';

    it('shows error message', async () => {
      const consoleError = console.error;
      console.error = sinon.spy();

      const promise = compileAndSave(config);
      await expect(promise).to.be.rejectedWith(Error, 'Compilation failed');
      expect(console.error).to.be.calledWith(expectedOutput);

      console.error = consoleError;
    });
  });
});
