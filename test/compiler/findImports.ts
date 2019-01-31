import {expect} from 'chai';
import {findImports} from '../../lib/compiler/findImports';
import {readFileContent} from '../../lib/utils';
import { ImportFile } from '@resolver-engine/imports';

const DATA: ImportFile[] = [
  {
    url: '/tmp/waffle/b',
    source: 'content of b.sol',
    provider: 'unknown'
  },
  {
    url: 'test/projects/example/BasicToken.sol',
    source: readFileContent('test/projects/example/BasicToken.sol'),
    provider: 'unkown'
  }
];

describe('INTEGRATION: findImports', () => {
  DATA.forEach((importFile) => {
    it(`correctly finds ${importFile.url}`, async () => {
      const result = findImports(DATA)(importFile.url);
      expect(result).to.be.deep.equal({contents: importFile.source});
    });
  });

  it('findImports file not found', async () => {
    const result = findImports(DATA)('random/nonexisting.sol');
    expect(result).to.deep.equal({error: `File not found: random/nonexisting.sol`});
  });
});
