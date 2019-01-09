import chai, {expect} from 'chai';
import SolcJsWrapper from '../../../lib/wrappers/solcjsWrapper';
import {readFileContent} from '../../../lib/utils';

chai.use(require('chai-string'));

const expectedInputs = [
  'test/projects/example/BasicToken.sol',
  'test/projects/example/ERC20Basic.sol',
  'test/projects/example/mock/BasicTokenMock.sol'
];

describe('UNIT: SolcJsWrapper', () => {
  let wrapper;

  before(() => {
    wrapper = new SolcJsWrapper();
  });

  it('findInputs', async () => {
    const actualInputs = await wrapper.findInputs(expectedInputs);
    expect(Object.keys(actualInputs)).to.deep.eq(expectedInputs);
    const basicTokenContractActual = actualInputs['test/projects/example/BasicToken.sol'];
    const basicTokenContractExpected = await readFileContent('test/projects/example/BasicToken.sol');
    expect(basicTokenContractActual).to.deep.eq(basicTokenContractExpected);
  });
});
