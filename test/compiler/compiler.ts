import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiString from 'chai-string';
import {compile, compileAndSave} from '../../lib/compiler/compiler';
import defaultConfig from '../../lib/config/config';
import * as path from 'path';

const sourcesPath = './test/projects/example';
const targetPath = './test/compiler/build';
const config = {...defaultConfig, sourcesPath, targetPath};

chai.use(chaiString);
chai.use(sinonChai);

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
    const sourcesPath = './test/projects/invalidContracts'; // tslint:disable-line
    const targetPath = './test/projects/build'; // tslint:disable-line
    const config = {...defaultConfig, sourcesPath, targetPath}; // tslint:disable-line
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
