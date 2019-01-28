import fs from 'fs-extra';
import {expect} from 'chai';
import { findInputs } from '../../lib/compiler/findInputs';

describe('INTEGRATION: findInputs', () => {
  before(async () => {
    await fs.mkdirp('/tmp/waffle/a');
    await fs.mkdirp('/tmp/waffle/b');
    await fs.mkdirp('/tmp/waffle/c/c');

    await fs.writeFile('/tmp/waffle/b/b.sol', '');
    await fs.writeFile('/tmp/waffle/b/xxx.xxx', '');
    await fs.writeFile('/tmp/waffle/c/c1.sol', '');
    await fs.writeFile('/tmp/waffle/c/c/c2.sol', '');
  });

  after(async () => {
    await fs.remove('/tmp/waffle');
  });

  it('returns empty array for an empty forlder', () => {
    const result = findInputs('/tmp/waffle/a');
    expect(result).to.deep.equal([]);
  });

  it('only returns .sol files', () => {
    const result = findInputs('/tmp/waffle/b');
    expect(result).to.deep.equal([
      '/tmp/waffle/b/b.sol'
    ]);
  });

  it('returns files found in a folder recursively', () => {
    const result = findInputs('/tmp/waffle/c');
    expect(result).to.deep.equal([
      '/tmp/waffle/c/c1.sol',
      '/tmp/waffle/c/c/c2.sol'
    ]);
  });
});
