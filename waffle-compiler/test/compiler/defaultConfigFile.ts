import fsx from 'fs-extra';
import {join} from 'path';
import {expect} from 'chai';
import {compileProject} from '../../src/compiler';
import {readFileContent} from '../../src/utils';

const expectedMinimalOutput: object = {
  abi: [
    {
      constant: true,
      inputs: [],
      name: 'constantinople',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function'
    }
  ],
  // eslint-disable-next-line max-len
  bytecode: '6080604052348015600f57600080fd5b5060998061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063610d808a14602d575b600080fd5b6033604f565b604051808260ff1660ff16815260200191505060405180910390f35b60008060009050600260011b9050809150509056fea265627a7a72315820d95b5f20b7b2c1f8e4f680cf11f1f842d605d3f33a428521835abc6a94339e3564736f6c634300050f0032'
};

describe('E2E: defaultConfigFile', () => {
  before(() => {
    process.chdir('test/projects/defaultConfigFile');
  });

  beforeEach(() => {
    fsx.removeSync('build');
  });

  it('Using waffle.json as default config file', async () => {
    await compileProject();
    const filePath = join('./build', 'Constantinople.json');
    const actualOutput = JSON.parse(readFileContent(filePath));
    expect(actualOutput).to.deep.equal(expectedMinimalOutput);
  });

  after(async () => {
    process.chdir('../../..');
  });
});
