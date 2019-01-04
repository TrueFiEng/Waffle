import fs from 'fs';
import fsx from 'fs-extra';
import {expect} from 'chai';
import {compile} from '../../lib/compiler';
import {isFile} from '../../lib/utils';

describe('Compile with custom config', () => {
  it('solcjs', async () => {
    fsx.removeSync('test/compiler/custom/custom_build');
    await compile('./test/compiler/custom/config.json');
    expect(fs.existsSync('test/compiler/custom/custom_build')).to.be.true;
    expect(isFile('test/compiler/custom/custom_build/Custom.json')).to.be.true;
    expect(isFile('test/compiler/custom/custom_build/CustomSafeMath.json')).to.be.true;
  });

  it('solc', async () => {
    fsx.removeSync('test/compiler/custom/custom_build');
    await compile('./test/compiler/custom/config_solc.json');
    expect(fs.existsSync('test/compiler/custom/custom_build')).to.be.true;
    expect(isFile('test/compiler/custom/custom_build/Custom.json')).to.be.true;
    expect(isFile('test/compiler/custom/custom_build/CustomSafeMath.json')).to.be.true;
  });

  it('dockerized solc', async () => {
    fsx.removeSync('test/compiler/custom/custom_build');
    await compile('./test/compiler/custom/config_docker.json');
    expect(fs.existsSync('test/compiler/custom/custom_build')).to.be.true;
    expect(isFile('test/compiler/custom/custom_build/Custom.json')).to.be.true;
    expect(isFile('test/compiler/custom/custom_build/CustomSafeMath.json')).to.be.true;
  });
});
