import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiString from 'chai-string';
import Compiler from '../../lib/compiler/compiler';

const sourcesPath = './test/projects/example';
const targetPath = './test/compiler/build';
const config = {sourcesPath, targetPath};

chai.use(chaiString);
chai.use(sinonChai);

describe('INTEGRATION: Compiler', () => {
  let compiler: Compiler;

  beforeEach(async () => {
    compiler = new Compiler(config);
  });

  describe('doCompile', () => {
    let output: any;
    beforeEach(async () => {
      output = await compiler.doCompile();
    });

    it('just compile', async () => {
      const basicTokenOutput = output.contracts['test/projects/example/BasicToken.sol'].BasicToken;
      expect(output.errors).to.equal(undefined);
      expect(basicTokenOutput.evm.bytecode.object).to.startsWith('6080604052');
      expect(JSON.stringify(basicTokenOutput.abi)).to.startsWith('[{"constant":true,');
    });
  });

  describe('compile: invalid input', () => {
    const sourcesPath = './test/projects/invalidContracts'; // tslint:disable-line
    const targetPath = './test/projects/build'; // tslint:disable-line
    const config = {sourcesPath, targetPath}; // tslint:disable-line
    const expectedOutput = 'test/projects/invalidContracts/invalid.sol:6:14: ' +
      'DeclarationError: Identifier not found or not unique.\n' +
      '  function f(wrongType arg) public {\n             ^-------^\n';

    it('shows error message', async () => {
      const consoleError = console.error;
      console.error = sinon.spy();

      compiler = new Compiler(config);
      const promise = compiler.compile();
      await expect(promise).to.be.rejectedWith(Error, 'Compilation failed');
      expect(console.error).to.be.calledWith(expectedOutput);

      console.error = consoleError;
    });
  });
});
