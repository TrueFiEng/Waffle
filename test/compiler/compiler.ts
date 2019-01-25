import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiString from 'chai-string';
import Compiler from '../../lib/compiler/compiler';
import {readFileContent} from '../../lib/utils';

const sourcesPath = './test/projects/example';
const targetPath = './test/compiler/build';
const config = {sourcesPath, targetPath};
const expectedInputs = [
  'test/projects/example/BasicToken.sol',
  'test/projects/example/ERC20Basic.sol',
  'test/projects/example/LibraryConsumer.sol',
  'test/projects/example/MyLibrary.sol',
  'test/projects/example/SafeMath.sol',
  'test/projects/example/mock/BasicTokenMock.sol'
];

chai.use(chaiString);
chai.use(sinonChai);

describe('INTEGRATION: Compiler', () => {
  let compiler: Compiler;

  beforeEach(async () => {
    compiler = new Compiler(config);
  });

  it('findImports in source path', async () => {
    const expected = await readFileContent('test/projects/example/BasicToken.sol');
    const actual = compiler.findImports('test/projects/example/BasicToken.sol');
    expect(expected).to.eq(actual.contents);
  });

  it('findImports in imports path', async () => {
    const expected = await readFileContent('node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol');
    const actual = compiler.findImports('openzeppelin-solidity/contracts/math/SafeMath.sol');
    expect(expected).to.eq(actual.contents);
  });

  it('findImports file not found', async () => {
    const expected = {error: `File not found: random/nonexisting.sol`};
    const actual = compiler.findImports('random/nonexisting.sol');
    expect(expected).to.deep.eq(actual);
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
      const overrideConsole = {error: sinon.spy()} as any;
      const overrideProcess = {exit: sinon.spy()} as any;
      compiler = new Compiler(config, {overrideConsole, overrideProcess});
      await compiler.compile();
      expect(overrideConsole.error).to.be.calledWith(expectedOutput);
      expect(overrideProcess.exit).to.be.calledWith(1);
    });
  });
});
