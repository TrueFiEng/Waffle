import {expect} from 'chai';
import {getGanacheOptions} from '../../../lib';
import path from 'path';

describe('INTEGRATION: getGanacheOptions', () => {
  it('ganacheOptions as object', () => {
    const ganacheOptions = {gasLimit: 50, gasPrice: '1'};
    expect(getGanacheOptions(ganacheOptions)).to.equal(ganacheOptions);
  });

  it('ganacheOptions as invalid path to config', () => {
    const pathToConfig = ('./config.json');
    expect(() => getGanacheOptions(pathToConfig)).to.throw(Error, 'Cannot find module \'./config.json\'');
  });

  it('ganacheOptions as valid path to config', () => {
    const pathToConfig = path.join(__dirname, 'config.json');
    const expectedGanacheOptions = require('./config.json').ganacheOptions;
    expect(getGanacheOptions(pathToConfig)).to.equal(expectedGanacheOptions);
  });
});
