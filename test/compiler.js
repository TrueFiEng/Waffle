import Compiler from '../lib/compiler'
import {fileContent} from '../lib/utils'
import chai from 'chai';
import {promises} from 'fs';

const {expect} = chai;
const sourcesPath = './test/contracts';
const targetPath = './test/build';
const config = {sourcesPath, targetPath};  
const expectedInputs = [
  'test/contracts/BasicToken.sol', 
  'test/contracts/ERC20Basic.sol', 
  'test/contracts/mock/BasicTokenMock.sol'
];

chai.use(require('chai-string'));

describe.only('Compiler', () => {  
  let compiler;
  
  beforeEach(async () => {
    compiler = new Compiler(config);
  });
  
  it("findInputsFiles", async () => {
    const actualInputs = await compiler.findInputFiles({sourcesPath, targetPath});    
    expect(actualInputs).to.deep.eq(expectedInputs);
  });

  it("findInputs", async () => {
    const actualInputs = await compiler.findInputs({sourcesPath, targetPath});
    expect(Object.keys(actualInputs)).to.deep.eq(expectedInputs);
    const basicTokenContractActual = actualInputs['test/contracts/BasicToken.sol'];
    const basicTokenContractExpected = await fileContent('test/contracts/BasicToken.sol');
    expect(basicTokenContractActual).to.deep.eq(basicTokenContractExpected);
  });

  it("findImports in source path", async () => {
    const expected = await fileContent('test/contracts/BasicToken.sol');
    const actual = compiler.findImports('test/contracts/BasicToken.sol');    
    expect(expected).to.eq(actual.contents);
  });

  it("findImports in imports path", async () => {                
    const expected = await fileContent('node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol');    
    const actual = compiler.findImports('openzeppelin-solidity/contracts/math/SafeMath.sol');
    expect(expected).to.eq(actual.contents);
  });

  it("findImports file not found", async () => {
    const expected = { error: `File not found: random/nonexisting.sol` }
    const actual = compiler.findImports('random/nonexisting.sol');
    expect(expected).to.deep.eq(actual);
  });

  it("compile", async () => {
    const output = await compiler.compile();
    const basicTokenOutput = output['contracts']['test/contracts/BasicToken.sol:BasicToken'];
    expect(output.errors).to.be.undefined;
    expect(basicTokenOutput.bytecode).to.startsWith('6080604052');
    expect(basicTokenOutput.interface).to.startsWith('[{"constant":true,');
  });
});
