import fs from 'fs';
import fsx from 'fs-extra';
import {expect} from 'chai';
import {compile} from '../../lib/compiler';

describe('Compile', () => {
  it('with custom config', async () => {
    fsx.removeSync('test/compiler/custom/custom_build');
    await compile('./test/compiler/custom/config.json');
    expect(fs.existsSync('test/compiler/custom/custom_build')).to.be.true;
    expect(fs.lstatSync('test/compiler/custom/custom_build/Custom.json').isFile()).to.be.true;
    expect(fs.lstatSync('test/compiler/custom/custom_build/CustomSafeMath.json').isFile()).to.be.true;
  });
});
