import chai, {expect} from 'chai';
import chaiString from 'chai-string';
import {findInputs} from '../../../lib/compiler/compileSolcjs';
import {readFileContent} from '../../../lib/utils';

chai.use(chaiString);

const expectedInputs = [
  'test/projects/example/BasicToken.sol',
  'test/projects/example/ERC20Basic.sol',
  'test/projects/example/mock/BasicTokenMock.sol'
];

describe('UNIT: findInputs', () => {
  it('findInputs', async () => {
    const actualInputs = findInputs(expectedInputs);
    expect(Object.keys(actualInputs)).to.deep.eq(expectedInputs);
    const basicTokenContractActual = actualInputs['test/projects/example/BasicToken.sol'];
    const basicTokenContractExpected = await readFileContent('test/projects/example/BasicToken.sol');
    expect(basicTokenContractActual).to.deep.eq(basicTokenContractExpected);
  });
});
