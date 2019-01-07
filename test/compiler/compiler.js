import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Compiler from '../../lib/compiler';
import {isFile, readFileContent} from '../../lib/utils';
import fs from 'fs';
import fsx from 'fs-extra';

const sourcesPath = './test/compiler/contracts';
const targetPath = './test/compiler/build';
const config = {sourcesPath, targetPath};
const expectedInputs = [
  'test/compiler/contracts/BasicToken.sol',
  'test/compiler/contracts/ERC20Basic.sol',
  'test/compiler/contracts/LibraryConsumer.sol',
  'test/compiler/contracts/MyLibrary.sol',
  'test/compiler/contracts/SafeMath.sol',
  'test/compiler/contracts/mock/BasicTokenMock.sol'
];

chai.use(require('chai-string'));
chai.use(sinonChai);

describe('(UNIT) Compiler', () => {
  let compiler;

  beforeEach(async () => {
    compiler = new Compiler(config);
  });

  it('findInputsFiles', async () => {
    const actualInputs = await compiler.findInputFiles(sourcesPath);
    expect(actualInputs).to.deep.eq(expectedInputs);
  });

  it('findImports in source path', async () => {
    const expected = await readFileContent('test/compiler/contracts/BasicToken.sol');
    const actual = compiler.findImports('test/compiler/contracts/BasicToken.sol');
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
    let output;
    beforeEach(async () => {
      output = await compiler.doCompile();
    });

    it('just compile', async () => {
      const basicTokenOutput = output.contracts['test/compiler/contracts/BasicToken.sol'].BasicToken;
      expect(output.errors).to.be.undefined;
      expect(basicTokenOutput.evm.bytecode.object).to.startsWith('6080604052');
      expect(JSON.stringify(basicTokenOutput.abi)).to.startsWith('[{"constant":true,');
    });

    it('save output', async () => {
      compiler.saveOutput(output);
      expect(isFile('test/compiler/build/BasicToken.json')).to.be.true;
      fsx.removeSync('test/compiler/build');
      expect(fs.existsSync('test/compiler/build')).to.be.false;
    });
  });

  describe('compile: invalid input', () => {
    const sourcesPath = './test/compiler/invalidContracts';
    const targetPath = './test/compiler/build';
    const config = {sourcesPath, targetPath};
    const expectedOutput = 'test/compiler/invalidContracts/invalid.sol:5:16: DeclarationError: Identifier not found or not unique.\n    function f(wrongType arg) public {\n               ^-------^\n';

    it('shows error message', async () => {
      const overrideConsole = {error: sinon.spy()};
      const overrideProcess = {exit: sinon.spy()};
      compiler = new Compiler(config, {overrideConsole, overrideProcess});
      await compiler.compile();
      expect(overrideConsole.error).to.be.calledWith(expectedOutput);
      expect(overrideProcess.exit).to.be.calledWith(1);
    });
  });
});
