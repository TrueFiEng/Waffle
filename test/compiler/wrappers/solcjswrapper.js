import chai, {expect} from 'chai';
import SolcJsWrapper from '../../../lib/wrappers/solcjsWrapper';
import {readFileContent} from '../../../lib/utils';

chai.use(require('chai-string'));

const expectedInputs = [
  'test/compiler/contracts/BasicToken.sol',
  'test/compiler/contracts/ERC20Basic.sol',
  'test/compiler/contracts/mock/BasicTokenMock.sol'
];

describe('SolcJsWrapper', () => {
  let wrapper;

  before(() => {
    wrapper = new SolcJsWrapper();
  });

  it('findInputs', async () => {
    const actualInputs = await wrapper.findInputs(expectedInputs);
    expect(Object.keys(actualInputs)).to.deep.eq(expectedInputs);
    const basicTokenContractActual = actualInputs['test/compiler/contracts/BasicToken.sol'];
    const basicTokenContractExpected = await readFileContent('test/compiler/contracts/BasicToken.sol');
    expect(basicTokenContractActual).to.deep.eq(basicTokenContractExpected);
  });
});
