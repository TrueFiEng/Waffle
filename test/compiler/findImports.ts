import fs from 'fs-extra';
import {expect} from 'chai';
import {findImports} from '../../lib/compiler/findImports';
import {readFileContent} from '../../lib/utils';

describe('INTEGRATION: findImports', () => {
  before(async () => {
    await fs.mkdirp('/tmp/waffle/b');
    await fs.writeFile('/tmp/waffle/b/b.sol', 'contents of b.sol');
  });

  after(async () => {
    await fs.remove('/tmp/waffle');
  });

  it('finds imports in source path', async () => {
    const contents = await readFileContent('test/projects/example/BasicToken.sol');
    const result = findImports('/')('test/projects/example/BasicToken.sol');
    expect(result).to.deep.equal({contents});
  });

  it('finds imports in library path', () => {
    const result = findImports('/tmp/waffle')('b/b.sol');
    expect(result).to.deep.equal({contents: 'contents of b.sol'});
  });

  it('findImports file not found', async () => {
    const result = findImports('/tmp/waffle')('random/nonexisting.sol');
    expect(result).to.deep.equal({error: `File not found: random/nonexisting.sol`});
  });
});
