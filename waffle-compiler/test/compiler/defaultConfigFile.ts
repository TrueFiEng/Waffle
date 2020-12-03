import fsx from 'fs-extra';
import {join} from 'path';
import {expect} from 'chai';
import {compileProject} from '../../src/compiler';
import {readFileContent} from '../../src/utils';

const expectedMinimalOutput: any = {
  abi: [
    {
      inputs: [
        {
          internalType: 'contract BasicToken',
          name: '_tokenContract',
          type: 'address'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      inputs: [],
      name: 'check',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    }
  ],
  // eslint-disable-next-line max-len
  bytecode: '608060405234801561001057600080fd5b5060405161020d38038061020d8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610179806100946000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063919840ad14610030575b600080fd5b610038610052565b604051808215151515815260200191505060405180910390f35b6000806000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156100f357600080fd5b505afa158015610107573d6000803e3d6000fd5b505050506040513d602081101561011d57600080fd5b8101908080519060200190929190505050905069d3c21bcecceda100000081119150509056fea26469706673582212202ff1f0eb889953832c44c8b4addba598dc4b28901c64a5925ed1d041ece54ae164736f6c63430006020033'
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
    const filePath = join('./build', 'AmIRichAlready.json');
    const actualOutput = JSON.parse(readFileContent(filePath));
    expect(actualOutput).to.deep.equal(expectedMinimalOutput);
  });

  after(async () => {
    process.chdir('../../..');
  });
});
