import chai, {expect} from 'chai';
import chaiString from 'chai-string';
import SolcJsWrapper from '../../../lib/compiler/solcjsWrapper';
import {readFileContent} from '../../../lib/utils';

chai.use(chaiString);

const expectedInputs = [
  'test/projects/example/BasicToken.sol',
  'test/projects/example/ERC20Basic.sol',
  'test/projects/example/mock/BasicTokenMock.sol'
];

describe('UNIT: SolcJsWrapper', () => {
  let wrapper: SolcJsWrapper;

  before(() => {
    wrapper = new SolcJsWrapper(null as any);
  });

  it('findInputs', async () => {
    const actualInputs = await wrapper.findInputs(expectedInputs);
    expect(Object.keys(actualInputs)).to.deep.eq(expectedInputs);
    const basicTokenContractActual = actualInputs['test/projects/example/BasicToken.sol'];
    const basicTokenContractExpected = await readFileContent('test/projects/example/BasicToken.sol');
    expect(basicTokenContractActual).to.deep.eq(basicTokenContractExpected);
  });
});
